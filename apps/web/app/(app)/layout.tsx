import { NavDock } from '@/components/nav-dock';

export default function AppGroupLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main>{children}</main>
      <NavDock />
    </>
  );
}
