import { SectionCard } from '@/components/section-card';

export default function LetterPage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-kicker">Time Capsule</p>
        <h1 className="hero-title">Letter</h1>
        <p className="hero-description">
          편지는 피드보다 긴 호흡으로 읽히는 화면입니다. 본문 가독성과 여백을 우선하며,
          visibility 규칙은 동일하게 서버에서 검증됩니다.
        </p>
      </section>

      <SectionCard title="작성 원칙" subtitle="정보 밀도보다 읽기 흐름을 우선합니다." tone="butter">
        <ul className="list-clean">
          <li>제목은 간결하게, 본문은 문단 단위로 분리</li>
          <li>PRIVATE / INVITED 공개 범위를 명확히 선택</li>
          <li>댓글은 상위 콘텐츠 접근 권한 범위에서만 허용</li>
        </ul>
      </SectionCard>

      <section className="grid-cards">
        <article className="post-card">
          <h3 style={{ marginTop: 0 }}>읽기 경험</h3>
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            긴 텍스트는 65ch 내로 폭을 제한해 시선 이동 피로를 줄입니다.
          </p>
        </article>
        <article className="post-card">
          <h3 style={{ marginTop: 0 }}>보안 규칙</h3>
          <p style={{ margin: 0, lineHeight: 1.65 }}>
            프론트 숨김은 편의일 뿐이며, 권한 판단은 API에서 확정합니다.
          </p>
        </article>
      </section>
    </div>
  );
}
