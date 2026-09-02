import React from 'react';
import { getPublicAnnouncements } from '@/server/announcement.service';
import { AnnouncementsContainer } from '@/components/public/announcements';
import { FadeIn } from '@/components/animations/FadeIn';
import { Announcement } from '@/types/announcement.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Announcements & Updates | ShopnerCoat Medical Examination Board',
  description:
    'Stay informed with the latest official academic notices, MBBS admission results, exam schedules, and clinical module circulars.',
};

export default async function AnnouncementsPage() {
  let announcements: Announcement[] = [];

  try {
    const data = await getPublicAnnouncements();
    if (data && Array.isArray(data)) {
      // Sort by newest published date first so the latest announcement is always at index 0
      announcements = [...data].sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.createdAt).getTime();
        const timeB = new Date(b.publishedAt || b.createdAt).getTime();
        return timeB - timeA;
      });
    }
  } catch (error) {
    console.warn('Backend announcement API returned error or unreachable:', error);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#E8F8F5]/50 via-white to-[#FAF8FF] pt-24 sm:pt-28 pb-20">
      
      {/* Ambient Medical Decorative Glows */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/6 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-10 w-[420px] h-[420px] bg-teal-300/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header matching mockup */}
        <div className="flex flex-col items-start max-w-3xl pt-4 sm:pt-8 mb-8 sm:mb-10">
          <FadeIn direction="up">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Announcements & Updates
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.08}>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Stay informed with the latest academic notices, exam schedules, and clinical module releases.
            </p>
          </FadeIn>
        </div>

        {/* 2-Column Announcements & Updates Layout with 3D Beacon */}
        <AnnouncementsContainer announcements={announcements} />

      </div>
    </div>
  );
}
