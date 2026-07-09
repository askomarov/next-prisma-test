import { cva } from "class-variance-authority";

export const panelVariants = cva(
  "rounded-lg border border-border p-4",
);

export const panelHeaderVariants = cva(
  "mb-3 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start",
);

export const panelTitleVariants = cva("m-0 text-sm font-semibold");

export const panelMetaVariants = cva("text-[0.8rem] text-neutral-400");

export const emptyStateVariants = cva("text-[0.8rem] text-neutral-400");
