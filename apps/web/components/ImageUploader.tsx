'use client';

/**
 * 이미지 업로드 컴포넌트
 *
 * - 최대 10장 사진 선택
 * - 썸네일 미리보기 + 개별 삭제
 * - Presigned URL 기반 MinIO 업로드
 * - 업로드 진행률 표시
 * - forwardRef로 부모에서 uploadAll() 호출 가능
 */

import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { api } from '../lib/api';

interface UploadedFile {
  file: File;
  preview: string;
  storageKey: string | null;
  progress: number;
  error: string | null;
}

export interface ImageUploaderRef {
  uploadAll: () => Promise<string[]>;
  hasFiles: () => boolean;
}

interface ImageUploaderProps {
  babyId: string;
  maxFiles?: number;
}

const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  function ImageUploader({ babyId, maxFiles = 10 }, ref) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const filesRef = useRef<UploadedFile[]>([]);

    // filesRef를 항상 최신 상태로 동기화
    filesRef.current = files;

    // 단일 파일 업로드
    const uploadSingleFile = useCallback(
      async (file: UploadedFile, index: number): Promise<string | null> => {
        try {
          const res = await api.post<{ data: { url: string; key: string } }>(
            '/storage/presigned-url',
            { babyId, fileName: file.file.name },
          );
          const { url, key } = res.data;

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', file.file.type);

            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                setFiles((prev) =>
                  prev.map((f, i) => (i === index ? { ...f, progress: percent } : f)),
                );
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) resolve();
              else reject(new Error(`업로드 실패 (${xhr.status})`));
            };

            xhr.onerror = () => reject(new Error('네트워크 오류'));
            xhr.send(file.file);
          });

          setFiles((prev) =>
            prev.map((f, i) =>
              i === index ? { ...f, storageKey: key, progress: 100, error: null } : f,
            ),
          );

          return key;
        } catch (err) {
          const message = err instanceof Error ? err.message : '업로드 실패';
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index ? { ...f, error: message, progress: 0 } : f,
            ),
          );
          return null;
        }
      },
      [babyId],
    );

    // 부모에서 호출할 메서드 노출
    useImperativeHandle(
      ref,
      () => ({
        uploadAll: async (): Promise<string[]> => {
          const currentFiles = filesRef.current;
          if (currentFiles.length === 0) return [];

          setUploading(true);
          const results = await Promise.all(
            currentFiles.map((file, index) =>
              file.storageKey
                ? Promise.resolve(file.storageKey)
                : uploadSingleFile(file, index),
            ),
          );
          setUploading(false);

          return results.filter((k): k is string => k !== null);
        },
        hasFiles: () => filesRef.current.length > 0,
      }),
      [uploadSingleFile],
    );

    // 파일 선택
    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? []);
        if (selectedFiles.length === 0) return;

        const remaining = maxFiles - filesRef.current.length;
        const toAdd = selectedFiles.slice(0, remaining);

        const newFiles: UploadedFile[] = toAdd.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          storageKey: null,
          progress: 0,
          error: null,
        }));

        setFiles((prev) => [...prev, ...newFiles]);
        if (inputRef.current) inputRef.current.value = '';
      },
      [maxFiles],
    );

    // 파일 삭제
    const removeFile = useCallback((index: number) => {
      setFiles((prev) => {
        URL.revokeObjectURL(prev[index].preview);
        return prev.filter((_, i) => i !== index);
      });
    }, []);

    // 에러 파일 재시도
    const retryFile = useCallback(
      async (index: number) => {
        const file = filesRef.current[index];
        if (!file?.error) return;

        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, error: null, progress: 0 } : f,
          ),
        );

        await uploadSingleFile(file, index);
      },
      [uploadSingleFile],
    );

    return (
      <div className="space-y-3">
        {/* 썸네일 미리보기 그리드 */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden bg-soft-dawn group"
              >
                <Image
                  src={file.preview}
                  alt={`첨부 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />

                {/* 업로드 진행률 오버레이 */}
                {file.progress > 0 && file.progress < 100 && !file.error && (
                  <div className="absolute inset-0 bg-inkroot/40 flex items-center justify-center">
                    <div className="w-10 h-10 relative">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                        <circle
                          cx="18" cy="18" r="15" fill="none" stroke="white" strokeWidth="2"
                          strokeDasharray={`${file.progress * 0.94} 94`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-pure-light text-[10px] font-bold">
                        {file.progress}%
                      </span>
                    </div>
                  </div>
                )}

                {/* 업로드 완료 체크 */}
                {file.storageKey && (
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-fresh-stem flex items-center justify-center">
                    <svg className="w-3 h-3 text-pure-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* 에러 표시 + 재시도 */}
                {file.error && (
                  <div className="absolute inset-0 bg-inkroot/50 flex flex-col items-center justify-center gap-1">
                    <svg className="w-5 h-5 text-blush-berry" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => retryFile(index)}
                      className="text-pure-light text-[10px] font-semibold underline"
                    >
                      재시도
                    </button>
                  </div>
                )}

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-inkroot/60
                    text-pure-light flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`이미지 ${index + 1} 삭제`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 파일 선택 버튼 */}
        {files.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-inkroot/15
              text-inkroot/40 hover:border-inkroot/30 hover:text-inkroot/60
              transition-colors flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span className="text-sm font-medium">
              사진 추가 ({files.length}/{maxFiles})
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  },
);

export default ImageUploader;
