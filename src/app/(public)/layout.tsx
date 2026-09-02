import { ReactNode } from 'react';
import { PublicNavbar, PublicNavbarUser } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnnouncementBar } from '@/components/public/AnnouncementBar';
import { getPublicAnnouncements } from '@/server/announcement.service';
import { getAccessToken, getUserRole } from '@/lib/server/getTokens';
import { getStudentMe } from '@/server/student.service';
import { Announcement } from '@/types/announcement.types';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [announcementsRes, token, role] = await Promise.all([
    getPublicAnnouncements().catch(() => [] as Announcement[]),
    getAccessToken(),
    getUserRole(),
  ]);

  let currentUser: PublicNavbarUser | undefined = undefined;

  if (token && role) {
    const userRole = role as 'ADMIN' | 'STUDENT';
    let name = userRole === 'ADMIN' ? 'Administrator' : 'Student';
    let photoUrl: string | null | undefined = undefined;
    let rollNumber: number | string | undefined = undefined;

    if (userRole === 'STUDENT') {
      try {
        const studentProfile = await getStudentMe(token);
        if (studentProfile) {
          name = studentProfile.fullName || name;
          photoUrl = studentProfile.photoUrl;
          rollNumber = studentProfile.rollNumber;
        }
      } catch {
        // Fallback to role-based label
      }
    }

    currentUser = {
      isAuthenticated: true,
      role: userRole,
      name,
      photoUrl,
      rollNumber,
    };
  }

  return (
    <div className="flex min-h-screen flex-col bg-background relative font-sans">
      {/* Top Banner (Responsive, Auto-rotating & Dismissible with Live Backend Announcements) */}
      <AnnouncementBar announcements={announcementsRes} />
      
      {/* Floating Navbar Container (Floats over the page content without white gap) */}
      <div className="sticky top-2.5 md:top-4 z-50 w-full pointer-events-none -mb-14 md:-mb-16">
        <div className="pointer-events-auto">
          <PublicNavbar user={currentUser} />
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
