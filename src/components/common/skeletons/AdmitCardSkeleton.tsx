export function AdmitCardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full aspect-[1/1.414] bg-card border rounded-lg animate-pulse p-8 flex flex-col gap-6">
      <div className="h-24 bg-teal-50 w-full rounded" />
      <div className="flex gap-6 flex-1">
        <div className="w-32 h-40 bg-muted rounded" />
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-teal-100 rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
      <div className="h-32 bg-muted rounded w-full" />
    </div>
  );
}
