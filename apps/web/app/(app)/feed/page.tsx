'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import PostCard from '../../../components/PostCard';
import Button from '../../../components/Button';
import type { PostResponseDto } from '@yuna/shared-types';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // data attribute에서 babyId와 role 가져오기
  const getBabyInfo = useCallback(() => {
    const main = document.querySelector('main');
    return {
      babyId: main?.dataset.babyId ?? '',
      role: main?.dataset.babyRole ?? '',
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

  const { role } = getBabyInfo();
  const isOwner = role === 'OWNER';

  return (
    <div className="space-y-4 animate-fade-in">
      {/* OWNER만 글 작성 가능 */}
      {isOwner && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/feed/new')}
          >
            + 새 게시물
          </Button>
        </div>
      )}

      {/* 게시물 목록 */}
      {posts.length === 0 && !loading ? (
        <div className="text-center py-16 text-inkroot/40">
          <p className="text-4xl mb-3">📷</p>
          <p className="text-sm">아직 게시물이 없습니다.</p>
          {isOwner && (
            <p className="text-xs mt-1">첫 번째 사진을 올려보세요!</p>
          )}
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      {/* 더 보기 */}
      {hasMore && !loading && (
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const next = page + 1;
              setPage(next);
              loadPosts(next);
            }}
          >
            더 보기
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-bounce-soft text-2xl">👶</div>
        </div>
      )}
    </div>
  );
}
