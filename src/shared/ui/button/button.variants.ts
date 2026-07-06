import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "w-full cursor-pointer rounded-md border border-neutral-900 bg-neutral-900 px-2.5 py-2 font-[inherit] text-sm text-white disabled:cursor-not-allowed disabled:opacity-60",
);
