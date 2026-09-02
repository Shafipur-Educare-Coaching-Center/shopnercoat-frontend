import { PageHeader } from '@/components/common/PageHeader';
import { getAccessToken } from '@/lib/server/getTokens';
import { getStudentMe } from '@/server/student.service';
import { getMyEnrollments } from '@/server/enrollment.service';

export default async function StudentDashboardPage() {
  const token = await getAccessToken();
  
  const [student, enrollments] = await Promise.all([
    getStudentMe(token!).catch(() => null),
    getMyEnrollments(token!).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome, ${student?.fullName || 'Student'}`} 
        description="Here is your exam overview" 
      />
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-card border rounded-xl shadow-sm border-l-4 border-l-primary">
          <p className="text-sm text-muted-foreground font-medium">Roll Number</p>
          <p className="text-2xl font-bold font-mono text-primary mt-1">{student?.rollNumber || '---'}</p>
        </div>
        <div className="p-6 bg-card border rounded-xl shadow-sm border-l-4 border-l-primary">
          <p className="text-sm text-muted-foreground font-medium">Total Enrollments</p>
          <p className="text-2xl font-bold mt-1">{enrollments.length}</p>
        </div>
      </div>
    </div>
  );
}
