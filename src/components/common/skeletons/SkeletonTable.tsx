export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full animate-pulse border rounded-md">
      <div className="h-10 bg-teal-50 border-b flex items-center px-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-teal-100 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="h-12 border-b flex items-center px-4 gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-muted rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
