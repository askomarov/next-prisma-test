import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type PanelProps = {
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, meta, children, className }: PanelProps) {
  return (
    <section
      className={cn("rounded-lg border border-border p-4 space-y-3", className)}
    >
      <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
        {title ? <h2 className="text-sm font-semibold">{title}</h2> : null}
        {meta ? (
          <span className="text-xs text-muted-foreground">{meta}</span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}
