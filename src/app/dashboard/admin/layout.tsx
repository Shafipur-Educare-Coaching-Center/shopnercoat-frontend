import { ReactNode } from 'react';
import { getAccessToken } from '@/lib/server/getTokens';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = await getAccessToken();
  if (!token) redirect(ROUTES.LOGIN);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-slate-300 p-4 shrink-0">
        <div className="text-xl font-bold text-white mb-8">Admin Panel</div>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard/admin" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Dashboard</a>
          <a href="/dashboard/admin/students" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Students</a>
          <a href="/dashboard/admin/exams" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Exams</a>
          <a href="/dashboard/admin/admit-cards" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Admit Cards</a>
          <a href="/dashboard/admin/results" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Results</a>
          <a href="/dashboard/admin/announcements" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Announcements</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
