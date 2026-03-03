import { redirect } from 'next/navigation';

/** 루트 경로 → /feed 리다이렉트 */
export default function RootPage() {
  redirect('/feed');
}
