import { SkeletonCard } from './SkeletonCard';
import { SkeletonTable } from './SkeletonTable';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border p-4 space-y-4">
           <SkeletonTable rows={3} />
        </div>
        <div className="col-span-3 rounded-xl border p-4">
           <div className="h-full bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
