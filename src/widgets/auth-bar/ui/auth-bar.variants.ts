import { cva } from "class-variance-authority";

export const authBarVariants = cva(
  "border-b border-neutral-200 bg-neutral-50",
);

export const authBarInnerVariants = cva(
  "mx-auto flex container items-center gap-3 py-3",
);

export const authBarDesktopNavVariants = cva(
  "hidden items-center gap-3 sm:flex",
);

export const authBarLinkVariants = cva(
  "text-sm text-neutral-900 no-underline hover:underline",
);

export const logoutButtonVariants = cva(
  "hidden cursor-pointer rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-[inherit] text-sm hover:bg-neutral-100 sm:ml-auto sm:block",
);

export const authBarMobileMenuNavVariants = cva("grid gap-4");

export const authBarMobileMenuLinksVariants = cva("grid gap-1");

export const authBarMobileMenuActionsVariants = cva(
  "grid gap-2 border-t border-neutral-200 pt-4 [&_[data-slot=button]]:w-full",
);
