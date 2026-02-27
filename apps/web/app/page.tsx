import Link from 'next/link';
import { SectionCard } from '@/components/section-card';

export default function HomePage() {
  return (
    <main>
      <div className="page-stack">
        <section className="hero-card">
          <p className="hero-kicker">Private Family Archive</p>
          <h1 className="hero-title">Yuna&apos;s Day</h1>
          <p className="hero-description">
            초대받은 가족만 접근 가능한 기록 공간. 화려함보다 따뜻함, 귀여움보다 가독성을
            우선하는 앨범형 타임라인을 제공합니다.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="button button-primary">
              로그인 시작
            </Link>
            <Link href="/feed" className="button button-soft">
              피드 둘러보기
            </Link>
          </div>
        </section>

        <section className="grid-cards">
          <article className="post-card">
            <p className="hero-kicker">Access</p>
            <h3 style={{ margin: '8px 0 0' }}>초대 기반</h3>
            <p className="page-subtitle">초대되지 않은 사용자는 콘텐츠 접근이 불가합니다.</p>
          </article>
          <article className="post-card">
            <p className="hero-kicker">Quality</p>
            <h3 style={{ margin: '8px 0 0' }}>원본 우선</h3>
            <p className="page-subtitle">워터마크/강제 다운로드 노출 없이 기록 보존에 집중합니다.</p>
          </article>
          <article className="post-card">
            <p className="hero-kicker">Memory</p>
            <h3 style={{ margin: '8px 0 0' }}>가족 타임라인</h3>
            <p className="page-subtitle">피드, 편지, 댓글을 같은 맥락 안에서 자연스럽게 연결합니다.</p>
          </article>
        </section>

        <SectionCard
          title="왜 이렇게 바꿨나"
          subtitle="Noah & June 무드의 감성은 살리고, 정보 밀도는 더 정돈했습니다."
          tone="butter"
        >
          <ul className="list-clean">
            <li>컬러는 뉴트럴 기반 + 제한된 포인트 2색 원칙</li>
            <li>카드 라운드와 여백을 고정해 화면마다 일관성 유지</li>
            <li>장식 요소는 줄이고 타이포 계층을 명확히 강화</li>
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}
