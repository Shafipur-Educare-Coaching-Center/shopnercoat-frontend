import Link from 'next/link';
import { MedicalLogo } from '../common/MedicalLogo';
import { ROUTES } from '@/constants/routes';

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={ROUTES.HOME}>
          <MedicalLogo />
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href={ROUTES.HOME} className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href={ROUTES.HOW_TO_REGISTER} className="text-sm font-medium hover:text-primary transition-colors">How to Register</Link>
          <Link href={ROUTES.ANNOUNCEMENTS} className="text-sm font-medium hover:text-primary transition-colors">Announcements</Link>
          <Link href={ROUTES.RANKING} className="text-sm font-medium hover:text-primary transition-colors">Ranking</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href={ROUTES.LOGIN} className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
          <Link href={ROUTES.REGISTER} className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">Register</Link>
        </div>
      </div>
    </header>
  );
}
