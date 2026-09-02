'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { MedicalLogo } from '../common/MedicalLogo';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'How to Register', href: ROUTES.HOW_TO_REGISTER },
  { name: 'Announcement', href: ROUTES.ANNOUNCEMENTS },
  { name: 'Ranking', href: ROUTES.RANKING },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="px-3 md:px-4 w-full max-w-5xl mx-auto">
      <header className="rounded-xl md:rounded-2xl bg-white/95 backdrop-blur-md border border-border/80 shadow-clinical w-full">
        <div className="px-5 md:px-6 h-14 md:h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <Link href={ROUTES.HOME} className="shrink-0 flex items-center">
            <MedicalLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-primary",
                    isActive ? "text-primary font-bold" : "text-slate-500 font-medium"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-semibold text-primary hover:text-primary/80 px-4 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 -mr-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-md transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-white/95 rounded-b-xl"
            >
              <div className="px-5 py-4 flex flex-col gap-4">
                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "text-[15px] py-2.5 px-3 rounded-lg transition-colors",
                          isActive ? "bg-primary/10 text-primary font-bold" : "text-slate-600 font-medium hover:bg-slate-50 hover:text-primary"
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-border/50 pt-4 pb-2 flex flex-col gap-3">
                  <Link
                    href={ROUTES.LOGIN}
                    className="w-full text-center py-2.5 text-[15px] font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="w-full text-center bg-primary text-white hover:bg-primary/90 rounded-full py-2.5 text-[15px] font-semibold shadow-sm transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
