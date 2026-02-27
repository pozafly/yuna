import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  tone?: 'paper' | 'butter';
  className?: string;
}

export function SectionCard({
  title,
  subtitle,
  children,
  tone = 'paper',
  className
}: SectionCardProps) {
  const classes = [
    'section-card',
    tone === 'butter' ? 'section-card-butter' : '',
    className ?? ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes}>
      <header className="section-card-header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}
