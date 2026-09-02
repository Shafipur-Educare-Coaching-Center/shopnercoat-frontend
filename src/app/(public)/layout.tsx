import { ReactNode } from 'react';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { getPublicAnnouncements } from '@/server/announcement.service';
import { Announcement } from '@/types/announcement.types';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let announcements: Announcement[] = [];
  try {
    announcements = await getPublicAnnouncements();
  } catch (e) {
  }
  
  const urgent = announcements?.find(a => a.status === 'PUBLISHED');

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      {urgent && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-medium">
          <strong>Notice:</strong> {urgent.title}
        </div>
      )}
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
