const FINANCE_PATHS = [
  "/finance",
  "/finance/transactions",
  "/finance/categories",
] as const;

export function revalidateFinancePaths(revalidatePath: (path: string) => void) {
  for (const path of FINANCE_PATHS) {
    revalidatePath(path);
  }
}
