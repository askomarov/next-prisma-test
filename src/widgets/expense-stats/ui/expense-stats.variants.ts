import { cva } from "class-variance-authority";

export const expenseStatsSectionVariants = cva("mb-4 grid gap-4");

export const expenseStatsCurrencySectionVariants = cva("grid gap-4");

export const expenseStatsCurrencyTitleVariants = cva(
  "text-xs font-medium tracking-wide text-neutral-500 uppercase",
);

export const expenseStatsSummaryGridVariants = cva(
  "grid grid-cols-1 gap-3 sm:grid-cols-3",
);

export const expenseStatsChartsGridVariants = cva(
  "grid grid-cols-1 gap-4 lg:grid-cols-2",
);

export const expenseStatsChartCardVariants = cva("py-0");

export const expenseStatsChartContentVariants = cva("px-2 sm:px-6");
