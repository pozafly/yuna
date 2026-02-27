import { SectionCard } from '@/components/section-card';

export default function SettingsPage() {
  return (
    <div className="page-stack">
      <section className="hero-card">
        <p className="hero-kicker">Policy & Safety</p>
        <h1 className="hero-title">설정</h1>
        <p className="hero-description">
          설정 화면은 장식보다 명확한 정책 전달이 중요합니다. 삭제/탈퇴/권한 관련 카피는
          고대비로 강조하고 행동 결과를 분명히 안내합니다.
        </p>
      </section>

      <SectionCard title="핵심 정책" subtitle="서비스 보안 원칙과 직결되는 항목입니다.">
        <div className="grid-cards">
          <article className="post-card">
            <h3 style={{ marginTop: 0 }}>Baby 삭제</h3>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              삭제 즉시 접근 차단, 이후 30일간 OWNER 다운로드만 허용.
            </p>
          </article>
          <article className="post-card">
            <h3 style={{ marginTop: 0 }}>초대 만료</h3>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              초대 토큰은 발송 시점 기준 30분 후 만료.
            </p>
          </article>
          <article className="post-card">
            <h3 style={{ marginTop: 0 }}>댓글 삭제</h3>
            <p style={{ margin: 0, lineHeight: 1.65 }}>
              작성자 본인만 삭제 가능. OWNER도 타인 댓글 삭제 불가.
            </p>
          </article>
        </div>
      </SectionCard>

      <SectionCard
        title="디자인 원칙 적용 상태"
        subtitle="이번 리팩토링에서 반영한 시각 규칙"
        tone="butter"
      >
        <ul className="list-clean">
          <li>뉴트럴 배경 + 제한된 Accent 2색 운영</li>
          <li>카드 라운드/그림자/패딩의 일관된 토큰화</li>
          <li>모바일 우선 여백과 버튼 터치 영역 보장</li>
        </ul>
      </SectionCard>
    </div>
  );
}
