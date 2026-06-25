export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return <div className={`skeleton ${width} ${height} ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-bg-surface border border-border rounded-2xl p-6 space-y-4 ${className}`}>
      <SkeletonLine width="w-3/4" height="h-5" />
      <SkeletonLine width="w-full" height="h-4" />
      <SkeletonLine width="w-5/6" height="h-4" />
      <div className="flex gap-3 pt-2">
        <SkeletonLine width="w-20" height="h-7" className="rounded-full" />
        <SkeletonLine width="w-20" height="h-7" className="rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonRoadmap({ count = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-in" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="skeleton w-10 h-10 rounded-full" />
            {i < count - 1 && <div className="skeleton w-0.5 h-16 rounded-full" />}
          </div>
          <SkeletonCard className="flex-1" />
        </div>
      ))}
    </div>
  );
}
