'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../../../lib/api';
import PostCard from '../../../components/PostCard';
import CommentBottomSheet from '../../../components/CommentBottomSheet';
import Button from '../../../components/Button';
import Sticker from '../../../components/Sticker';
import BrandMark from '../../../components/BrandMark';
import Noah from '../../../components/Noah';
import Doodle from '../../../components/Doodle';
import BabyProfileCard from '../../../components/BabyProfileCard';
import ImageUploader from '../../../components/ImageUploader';
import { Visibility } from '@yuna/shared-types';
import type { PostResponseDto } from '@yuna/shared-types';
import type { ImageUploaderRef } from '../../../components/ImageUploader';

export default function FeedPage() {
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // 게시물 작성 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newVisibility, setNewVisibility] = useState<Visibility>(
    Visibility.INVITED,
  );
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const uploaderRef = useRef<ImageUploaderRef>(null);

  // 댓글 바텀시트 상태
  // activeCommentPostId가 null이면 닫힘, string이면 해당 postId의 바텀시트 열림
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null,
  );
  const [activeCommentCount, setActiveCommentCount] = useState(0);

  const getBabyInfo = useCallback(() => {
    const main = document.querySelector('main');
    return {
      babyId: main?.dataset.babyId ?? '',
      role: main?.dataset.babyRole ?? '',
      babyName: main?.dataset.babyName ?? '',
      babyBirthDate: main?.dataset.babyBirthDate ?? '',
    };
  }, []);

  const loadPosts = useCallback(
    async (pageNum: number, reset = false) => {
      const { babyId } = getBabyInfo();
      if (!babyId) return;

      setLoading(true);
      try {
        const res = await api.get<{
          data: { data: PostResponseDto[]; pagination: { totalPages: number } };
        }>(`/babies/${babyId}/posts?page=${pageNum}&limit=10`);
        const result = res.data;

        if (reset) {
          setPosts(result.data);
        } else {
          setPosts((prev) => [...prev, ...result.data]);
        }
        setHasMore(pageNum < result.pagination.totalPages);
      } catch {
        // 에러 무시
      } finally {
        setLoading(false);
      }
    },
    [getBabyInfo],
  );

  useEffect(() => {
    loadPosts(1, true);
  }, [loadPosts]);

  // 무한 스크롤
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          loadingRef.current = true;
          loadPosts(nextPage).finally(() => {
            loadingRef.current = false;
          });
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadPosts, hasMore]);

  // 게시물 작성 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCreateModal]);

  // ESC로 게시물 작성 모달 닫기
  useEffect(() => {
    if (!showCreateModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCreateModal]);

  const openModal = () => {
    setShowCreateModal(true);
    setNewContent('');
    setNewVisibility(Visibility.INVITED);
    setCreateError('');
  };

  const closeModal = () => {
    if (creating) return; // 작성 중에는 닫기 방지
    setShowCreateModal(false);
  };

  // 게시물 작성 제출
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      setCreateError('내용을 입력해 주세요.');
      return;
    }

    const { babyId } = getBabyInfo();
    if (!babyId) return;

    setCreating(true);
    setCreateError('');

    try {
      let mediaKeys: string[] = [];
      if (uploaderRef.current?.hasFiles()) {
        mediaKeys = await uploaderRef.current.uploadAll();
      }

      await api.post('/posts', {
        babyId,
        content: newContent.trim(),
        visibility: newVisibility,
        ...(mediaKeys.length > 0 && { mediaKeys }),
      });

      setShowCreateModal(false);
      // 피드 새로고침 (첫 페이지부터)
      pageRef.current = 1;
      loadPosts(1, true);
    } catch {
      setCreateError('게시물 작성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  /**
   * 댓글 바텀시트 열기 핸들러
   * PostCard에서 호출되며 해당 게시물의 postId와 commentCount를 전달받는다.
   */
  const handleOpenComments = useCallback(
    (postId: string) => {
      const targetPost = posts.find((p) => p.id === postId);
      setActiveCommentPostId(postId);
      setActiveCommentCount(targetPost?.commentCount ?? 0);
    },
    [posts],
  );

  /** 댓글 바텀시트 닫기 */
  const handleCloseComments = useCallback(() => {
    setActiveCommentPostId(null);
    setActiveCommentCount(0);
  }, []);

  /**
   * 댓글 추가 완료 콜백
   * 해당 게시물의 commentCount를 +1 갱신한다.
   */
  const handleCommentAdded = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p,
      ),
    );
    // 바텀시트 헤더의 commentCount도 실시간 반영
    setActiveCommentCount((prev) => prev + 1);
  }, []);

  const { role, babyName, babyBirthDate, babyId } = getBabyInfo();
  const isOwner = role === 'OWNER';

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Baby 프로필 카드 */}
      {babyName && (
        <BabyProfileCard
          name={babyName}
          birthDate={babyBirthDate || null}
          role={role}
          tagline="소중한 순간을 함께"
        />
      )}

      {/* 게시물 목록 */}
      {posts.length === 0 && !loading ? (
        <div className="text-center py-16 text-inkroot/40 space-y-4">
          <Noah size={140} className="mx-auto animate-bounce-soft" />
          <div className="flex justify-center gap-2">
            <Sticker text="cute" popIn />
            <Sticker text="noah" popIn />
          </div>
          <div className="flex justify-center gap-3">
            <Doodle type="sparkle" size={22} color="var(--color-petal-bloom)" />
            <Doodle type="heart" size={18} color="var(--color-blush-berry)" />
            <Doodle type="star" size={20} color="var(--color-sunbeam-pop)" />
          </div>
          <p className="display-tagline text-inkroot/60">
            아직 게시물이 없어요
          </p>
          {isOwner && (
            <div className="space-y-2">
              <p className="text-sm text-inkroot/50">
                첫 번째 사진을 올려보세요!
              </p>
              <Button variant="primary" size="sm" onClick={openModal}>
                + 첫 게시물 작성
              </Button>
            </div>
          )}
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpenComments={handleOpenComments}
          />
        ))
      )}

      {/* 무한 스크롤 센티넬 */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-bounce-soft">
            <BrandMark size={32} color="#DDA9F3" />
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-xs text-inkroot/30 py-4">
          모든 게시물을 불러왔어요
        </p>
      )}

      {/* FAB: 새 게시물 작성 */}
      {isOwner && (
        <button
          onClick={openModal}
          className="fixed bottom-24 right-5 md:bottom-8 md:right-8
            w-14 h-14 rounded-full bg-blush-berry text-pure-light
            shadow-lg hover:shadow-xl hover:scale-105
            active:scale-95 transition-all duration-200
            flex items-center justify-center z-40"
          aria-label="새 게시물 작성"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      {/* 전체화면 게시물 작성 모달 */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-pure-light animate-fade-in flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="새 게시물 작성"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-inkroot/5">
            <button
              type="button"
              onClick={closeModal}
              disabled={creating}
              className="text-sm text-inkroot/60 hover:text-inkroot transition disabled:opacity-50"
            >
              취소
            </button>
            <h2 className="font-display text-lg font-bold text-inkroot">
              새 게시물
            </h2>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newContent.trim()}
              className="text-sm font-semibold text-blush-berry hover:text-blush-berry/80
                transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {creating ? '게시 중...' : '게시'}
            </button>
          </div>

          {/* 바디 (스크롤 가능) */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleCreate} className="p-5 space-y-5">
              {/* 사진 첨부 */}
              {babyId && (
                <ImageUploader
                  ref={uploaderRef}
                  babyId={babyId}
                  maxFiles={10}
                />
              )}

              {/* 본문 */}
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="아이의 소중한 순간을 기록해 보세요..."
                rows={8}
                autoFocus
                className="w-full px-5 py-4 rounded-3xl bg-soft-dawn text-inkroot border-2 border-transparent
                  placeholder:text-inkroot/40 transition-all duration-200
                  focus:outline-none focus:border-fresh-stem/50 focus:ring-2 focus:ring-fresh-stem/10
                  focus:bg-pure-light resize-none"
              />

              {/* 공개 범위 */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-inkroot">
                  공개 범위
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewVisibility(Visibility.INVITED)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      newVisibility === Visibility.INVITED
                        ? 'bg-fresh-stem text-pure-light'
                        : 'bg-soft-dawn text-inkroot/60'
                    }`}
                  >
                    가족 전체
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewVisibility(Visibility.PRIVATE)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      newVisibility === Visibility.PRIVATE
                        ? 'bg-fresh-stem text-pure-light'
                        : 'bg-soft-dawn text-inkroot/60'
                    }`}
                  >
                    나만 보기
                  </button>
                </div>
              </div>

              {createError && (
                <p className="text-blush-berry text-sm px-1">{createError}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 댓글 바텀시트 (피드 JSX 최하단에 렌더링) */}
      <CommentBottomSheet
        postId={activeCommentPostId}
        commentCount={activeCommentCount}
        onClose={handleCloseComments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}
