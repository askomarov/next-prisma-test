const FINANCE_PATHS = [
  "/finance",
  "/finance/transactions",
  "/finance/categories",
  "/finance/stats",
] as const;

export function revalidateFinancePaths(
  revalidatePath: (path: string, type?: "page" | "layout") => void,
) {
  revalidatePath("/", "layout");

  for (const path of FINANCE_PATHS) {
    revalidatePath(path);
  }
}
