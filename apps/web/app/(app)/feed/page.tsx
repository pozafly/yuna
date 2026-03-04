'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import PostCard from '../../../components/PostCard';
import Button from '../../../components/Button';
import SectionLabel from '../../../components/SectionLabel';
import Sticker from '../../../components/Sticker';
import BrandMark from '../../../components/BrandMark';
import Noah from '../../../components/Noah';
import Doodle from '../../../components/Doodle';
import BabyProfileCard from '../../../components/BabyProfileCard';
import PageHero from '../../../components/PageHero';
import type { PostResponseDto } from '@yuna/shared-types';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // data attribute에서 babyId, role, name, birthDate 가져오기
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

  const { role, babyName, babyBirthDate } = getBabyInfo();
  const isOwner = role === 'OWNER';

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Baby 프로필 카드 */}
      {babyName && (
        <BabyProfileCard
          name={babyName}
          birthDate={babyBirthDate || null}
          role={role}
        />
      )}

      {/* 페이지 히어로 */}
      <PageHero
        tagline="소중한 순간을 함께"
        subtitle="우리 아이의 매일매일을 기록해요"
        variant="petal"
      />

      <SectionLabel>피드</SectionLabel>

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
          <p className="display-tagline text-inkroot/60">아직 게시물이 없어요</p>
          {isOwner && (
            <div className="space-y-2">
              <p className="text-sm text-inkroot/50">첫 번째 사진을 올려보세요!</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/feed/new')}
              >
                + 첫 게시물 작성
              </Button>
            </div>
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
          <div className="animate-bounce-soft">
            <BrandMark size={32} color="#DDA9F3" />
          </div>
        </div>
      )}
    </div>
  );
}
