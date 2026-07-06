import { cva } from "class-variance-authority";

export const pageShellVariants = cva("mx-auto max-w-[40rem] px-6 py-12");

export const pageHeroVariants = cva("mb-6");

export const pageEyebrowVariants = cva(
  "mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase",
);

export const pageTitleVariants = cva(
  "m-0 text-xl leading-snug font-semibold",
);

export const pageLedeVariants = cva(
  "mt-2 text-sm leading-relaxed text-neutral-500",
);
