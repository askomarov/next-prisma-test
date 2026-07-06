import { cva } from "class-variance-authority";

export const selectVariants = cva(
  "w-full rounded-md border border-neutral-200 bg-white px-2.5 py-2 font-[inherit] text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10",
  {
    variants: {
      error: {
        true: "border-red-600 focus:border-red-600 focus:ring-red-600/10",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);
