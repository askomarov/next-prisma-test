import { cva } from "class-variance-authority";

export const authBarVariants = cva(
  "border-b border-neutral-200 bg-neutral-50",
);

export const authBarInnerVariants = cva(
  "mx-auto flex container flex-wrap items-center gap-3 py-3",
);

export const authBarLinkVariants = cva(
  "text-sm text-neutral-900 no-underline hover:underline",
);

export const authBarEmailVariants = cva("text-sm");

export const roleBadgeVariants = cva(
  "rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
);

export const logoutButtonVariants = cva(
  "ml-auto cursor-pointer rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-[inherit] text-sm hover:bg-neutral-100",
);
