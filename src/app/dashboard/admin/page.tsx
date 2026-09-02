import { PageHeader } from '@/components/common/PageHeader';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Overview" 
        description="Platform statistics and metrics" 
      />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Stat cards would go here */}
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <p className="text-sm text-muted-foreground font-medium">Total Students</p>
          <p className="text-2xl font-bold mt-1">---</p>
        </div>
      </div>
    </div>
  );
}
