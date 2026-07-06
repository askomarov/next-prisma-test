import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import {
  pageEyebrowVariants,
  pageHeroVariants,
  pageLedeVariants,
  pageShellVariants,
  pageTitleVariants,
} from "./page-shell.variants";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <main className={cn(pageShellVariants(), className)}>{children}</main>;
}

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, lede, className }: PageHeroProps) {
  return (
    <div className={cn(pageHeroVariants(), className)}>
      <p className={pageEyebrowVariants()}>{eyebrow}</p>
      <h1 className={pageTitleVariants()}>{title}</h1>
      {lede ? <p className={pageLedeVariants()}>{lede}</p> : null}
    </div>
  );
}
