import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";
import {
  pageEyebrowVariants,
  pageHeroVariants,
  pageLedeVariants,
  pageShellVariants,
  pageTitleVariants,
} from "./page-shell.variants";

type PageShellProps = ComponentProps<"main">;

export function PageShell({ children, className, ...props }: PageShellProps) {
  return (
    <main className={cn(pageShellVariants(), className)} {...props}>
      {children}
    </main>
  );
}

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: ComponentProps<"p">["children"];
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
