'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import { MedicalLogo } from '@/components/common/MedicalLogo';
import { ROUTES } from '@/constants/routes';

// Inline SVGs for clean social icon buttons
function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
  );
}

export function PublicFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-700 font-sans">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand Info + Simplified Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-slate-200/60">
          
          {/* Brand Column (Takes 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href={ROUTES.HOME} className="w-fit">
              <MedicalLogo variant="footer" />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm font-normal">
              ShopnerCoat delivers modern medical examination management, candidate verified registration, admit card distribution, and transparent merit publication.
            </p>
          </div>

          {/* Links Grid: Quick Links, Candidate Portal & Legal (Takes 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Quick Links */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                <li><Link href={ROUTES.HOME} className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href={ROUTES.HOW_TO_REGISTER} className="hover:text-primary transition-colors">How to Register</Link></li>
                <li><Link href={ROUTES.ANNOUNCEMENTS} className="hover:text-primary transition-colors">Announcements</Link></li>
                <li><Link href={ROUTES.RANKING} className="hover:text-primary transition-colors">Merit Rankings</Link></li>
              </ul>
            </div>

            {/* Column 2: Candidate Portal */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Candidate Portal
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                <li><Link href={ROUTES.LOGIN} className="hover:text-primary transition-colors">Candidate Login</Link></li>
                <li><Link href={ROUTES.REGISTER} className="hover:text-primary transition-colors">New Registration</Link></li>
                <li><Link href={ROUTES.LOGIN} className="hover:text-primary transition-colors">Admit Card Retrieval</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Legal
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Board Regulations</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Section: Newsletter (Left) + Socials & Copyright (Right) */}
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          
          {/* Newsletter Form (Takes 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-slate-900 text-base">
              Stay Updated
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md font-normal leading-relaxed">
              Subscribe to receive the latest notifications on examination schedules, admit card releases, and official circulars.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 max-w-md">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-b-2 border-slate-300 py-2 px-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 disabled:bg-teal-700"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    Submit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Socials & Copyright (Takes 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4">
            
            <div className="flex flex-col items-start lg:items-end gap-2.5">
              <span className="text-xs font-semibold text-slate-500">
                Stay Connected
              </span>
              
              {/* Circular Social Icons */}
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all hover:scale-105"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="X"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all hover:scale-105"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all hover:scale-105"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Website"
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all hover:scale-105"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-normal pt-1">
              © {new Date().getFullYear()} ShopnerCoat. All rights reserved.
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}
