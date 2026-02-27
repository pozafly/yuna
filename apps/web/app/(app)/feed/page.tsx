import { SectionCard } from '@/components/section-card';
import { getBabies, getBabyPosts } from '@/lib/api';

export default async function FeedPage() {
  let babies = [] as Awaited<ReturnType<typeof getBabies>>;
  let posts = [] as Awaited<ReturnType<typeof getBabyPosts>>;
  let loadError: string | null = null;

  try {
    babies = await getBabies();
    const selectedBaby = babies[0];
    posts = selectedBaby ? await getBabyPosts(selectedBaby.id) : [];
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : '피드 로딩 중 오류가 발생했습니다.';
  }

  const selectedBaby = babies[0];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-kicker">Family Feed</p>
        <h1 className="hero-title">메인 피드</h1>
        <p className="hero-description">
          서버가 visibility를 최종 판단합니다. 프론트는 노출 계층을 정리하고 읽기 흐름을
          단순하게 유지합니다.
        </p>
        <div className="hero-actions">
          {selectedBaby ? <span className="chip chip-mint">선택 Baby: {selectedBaby.name}</span> : null}
          {selectedBaby ? <span className="chip chip-ink">내 역할: {selectedBaby.role}</span> : null}
        </div>
      </section>

      <SectionCard
        title="Baby 구성"
        subtitle="현재 계정이 접근 가능한 Baby만 표시됩니다."
      >
        <div className="grid-cards">
          {babies.map((baby) => (
            <article key={baby.id} className="post-card">
              <div className="post-meta">
                <span className="chip chip-coral">{baby.role}</span>
                <span className="chip chip-ink">{baby.status}</span>
              </div>
              <h3 style={{ margin: 0 }}>{baby.name}</h3>
              <p className="page-subtitle" style={{ margin: '8px 0 0' }}>
                Baby ID: {baby.id}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="최신 게시물"
        subtitle={selectedBaby ? `${selectedBaby.name} 타임라인` : '게시물이 없습니다.'}
        tone="butter"
      >
        {loadError ? <p className="error-box">{loadError}</p> : null}

        <div className="post-stream">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.id} className="post-item">
                <div className="post-meta">
                  <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                  <span>·</span>
                  <span>{post.authorName}</span>
                  <span
                    className={`chip ${
                      post.visibility === 'PRIVATE' ? 'chip-ink' : 'chip-mint'
                    }`}
                  >
                    {post.visibility}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px', lineHeight: 1.65 }}>{post.content}</p>
                <p style={{ margin: 0, color: 'rgba(31,29,26,0.62)', fontSize: 13 }}>
                  댓글 {post.commentCount}개
                </p>
              </article>
            ))
          ) : (
            <article className="post-item">
              <p style={{ margin: 0 }}>표시할 게시물이 아직 없습니다.</p>
            </article>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
