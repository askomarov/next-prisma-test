import { PageShell } from "@/shared/ui/page-shell";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function PageLoading() {
  return (
    <PageShell aria-busy="true" aria-live="polite">
      <div className="mb-6 space-y-3">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-7 w-3/4 max-w-md" />
        <SkeletonBlock className="h-4 w-full max-w-lg" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <SkeletonBlock className="h-9 w-32" />
        <SkeletonBlock className="h-9 w-44" />
      </div>

      <div className="rounded-lg border border-border p-4 shadow-xs">
        <div className="mb-4 flex items-center justify-between gap-4">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-8 w-24" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid gap-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
