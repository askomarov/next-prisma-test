import { cva } from "class-variance-authority";

export const paginationVariants = cva(
  "mt-3 flex items-center justify-between gap-4 border-t border-neutral-100 pt-3 text-[0.8rem]",
);

export const paginationLinkVariants = cva(
  "text-neutral-900 no-underline hover:underline",
);

export const paginationDisabledVariants = cva("text-neutral-300");

export const paginationInfoVariants = cva("text-neutral-400");
