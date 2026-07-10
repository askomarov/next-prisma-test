import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type PageShellProps = ComponentProps<"main">;

export function PageShell({ children, className, ...props }: PageShellProps) {
  return (
    <main className={cn("mx-auto max-w-160 px-6 py-12", className)} {...props}>
      {children}
    </main>
  );
}

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: ComponentProps<"p">["children"];
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  className,
}: PageHeroProps) {
  return (
    <div className={cn("mb-6 space-y-1", className)}>
      <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        {eyebrow}
      </p>
      <h1 className="text-xl mb-2 leading-snug font-semibold">{title}</h1>
      {lede ? (
        <p className=" text-sm leading-relaxed text-neutral-500">{lede}</p>
      ) : null}
      {children}
    </div>
  );
}
