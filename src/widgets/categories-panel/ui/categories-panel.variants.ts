import { cva } from "class-variance-authority";

export const categoriesListVariants = cva("m-0 grid list-none gap-2 p-0");

export const categoryItemVariants = cva(
  "flex items-center justify-between gap-4 rounded-md border border-neutral-100 px-3 py-2.5 max-sm:flex-col max-sm:items-start",
);

export const categoryActionsVariants = cva(
  "flex flex-wrap items-center gap-2 max-sm:w-full",
);

export const categoryKindVariants = cva(
  "rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium",
);
