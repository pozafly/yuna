/**
 * 섹션 라벨 컴포넌트
 *
 * 디자인 가이드: 각 섹션 상단에 소형 대문자 라벨을 배치하여 맥락 제공
 * Inter 500, 0.75rem, letter-spacing 0.3em, uppercase, opacity 0.7
 */

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = '',
}: SectionLabelProps) {
  return (
    <p className={`section-label mb-4 ${className}`}>{children}</p>
  );
}
