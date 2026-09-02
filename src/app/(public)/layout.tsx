import { ReactNode } from 'react';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnnouncementBar } from '@/components/public/AnnouncementBar';
import { getPublicAnnouncements } from '@/server/announcement.service';
import { Announcement } from '@/types/announcement.types';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let announcements: Announcement[] = [];
  try {
    announcements = await getPublicAnnouncements();
  } catch (e) {
  }
  
  const urgent = announcements?.find(a => a.status === 'PUBLISHED');
  const announcementMessage = urgent ? urgent.title : 'Registration for 2024-25 session is now open! Limited seats available.';

  return (
    <div className="flex min-h-screen flex-col bg-background relative font-sans">
      {/* Top Banner (Responsive & Dismissible) */}
      <AnnouncementBar 
        id={urgent ? urgent.id : 'default-urgent'} 
        message={announcementMessage} 
      />
      
      {/* Floating Navbar Container (Floats over the page content without white gap) */}
      <div className="sticky top-2.5 md:top-4 z-50 w-full pointer-events-none -mb-14 md:-mb-16">
        <div className="pointer-events-auto">
          <PublicNavbar />
        </div>
      </div>
      
      {/* Main Page Content (Hero background starts right from pixel 0 below the banner) */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <PublicFooter />
    </div>
  );
}
