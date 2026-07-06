import { cva } from "class-variance-authority";

export const usersListVariants = cva("m-0 grid list-none gap-2 p-0");

export const userItemVariants = cva(
  "flex items-center justify-between gap-4 rounded-md border border-neutral-100 px-3 py-2.5 max-sm:flex-col max-sm:items-start",
);

export const userEmailVariants = cva("mt-0.5");

export const userTimeVariants = cva(
  "text-xs whitespace-nowrap text-neutral-400",
);

export const inlineCodeVariants = cva(
  "rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.875em]",
);
