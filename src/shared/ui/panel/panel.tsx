import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import {
  emptyStateVariants,
  panelHeaderVariants,
  panelMetaVariants,
  panelTitleVariants,
  panelVariants,
} from "./panel.variants";

type PanelProps = {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, meta, children, className }: PanelProps) {
  return (
    <section className={cn(panelVariants(), className)}>
      <div className={panelHeaderVariants()}>
        <h2 className={panelTitleVariants()}>{title}</h2>
        {meta ? <span className={panelMetaVariants()}>{meta}</span> : null}
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
  return <p className={cn(emptyStateVariants(), className)}>{children}</p>;
}
