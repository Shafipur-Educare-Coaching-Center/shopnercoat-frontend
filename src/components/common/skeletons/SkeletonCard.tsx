export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-pulse space-y-4">
      <div className="h-4 bg-teal-100 rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="h-8 bg-teal-50 rounded w-1/4" />
    </div>
  );
}
