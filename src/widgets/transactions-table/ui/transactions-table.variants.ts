import { cva } from "class-variance-authority";

export const transactionsListVariants = cva("m-0 grid list-none gap-2 p-0");

export const transactionItemVariants = cva(
  "flex items-center justify-between gap-4 rounded-md border border-neutral-100 px-3 py-2.5 max-sm:flex-col max-sm:items-start",
);

export const transactionItemActionsVariants = cva(
  "flex items-end gap-3 max-sm:w-full max-sm:flex-col max-sm:items-start",
);

export const transactionMetaVariants = cva("mt-0.5 text-sm text-neutral-500");

export const transactionDateVariants = cva(
  "text-xs whitespace-nowrap text-neutral-400",
);

export const transactionAmountVariants = cva("text-sm font-semibold tabular-nums", {
  variants: {
    kind: {
      INCOME: "text-green-700",
      EXPENSE: "text-red-700",
    },
  },
});

export const inlineCodeVariants = cva(
  "rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.875em]",
);
