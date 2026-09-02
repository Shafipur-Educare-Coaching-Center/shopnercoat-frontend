import { ReactNode } from 'react';
import { getAccessToken } from '@/lib/server/getTokens';
import { getStudentMe } from '@/server/student.service';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const token = await getAccessToken();
  if (!token) redirect(ROUTES.LOGIN);

  let student;
  try {
    student = await getStudentMe(token);
  } catch (err: any) {
    if (err.statusCode === 401) redirect(ROUTES.LOGIN);
    // If not found, they might need to complete profile
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-slate-300 p-4 shrink-0">
        <div className="text-xl font-bold text-white mb-8">ShopnerCoat</div>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard/student" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Dashboard</a>
          <a href="/dashboard/student/profile" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Profile</a>
          <a href="/dashboard/student/exams" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Exams</a>
          <a href="/dashboard/student/enrollments" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Enrollments</a>
          <a href="/dashboard/student/admit-cards" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Admit Cards</a>
          <a href="/dashboard/student/results" className="p-2 rounded hover:bg-teal-600 hover:text-white transition-colors">Results</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
