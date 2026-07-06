import { cva } from "class-variance-authority";

export const dialogVariants = cva(
  "w-full max-w-md m-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-lg backdrop:bg-black/40",
);

export const dialogHeaderVariants = cva(
  "mb-4 flex items-start justify-between gap-4",
);

export const dialogTitleVariants = cva("m-0 text-sm font-semibold");

export const dialogCloseVariants = cva(
  "cursor-pointer rounded border border-neutral-200 bg-white px-2 py-0.5 text-lg leading-none text-neutral-500 hover:text-neutral-900",
);
