export function NotificationSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="size-2.5 rounded-full bg-secondary animate-shimmer shrink-0" />
              <div className="h-5 w-48 rounded-lg bg-secondary animate-shimmer" />
            </div>
            <div className="h-4 w-24 rounded bg-secondary animate-shimmer shrink-0" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-4 w-full rounded bg-secondary animate-shimmer" />
            <div className="h-4 w-3/4 rounded bg-secondary animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
