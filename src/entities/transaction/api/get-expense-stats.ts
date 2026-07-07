import type { TransactionFilters } from "../lib/build-transactions-where";
import type {
  TransactionCategoryStat,
  TransactionCurrencyStats,
  TransactionMonthStat,
  TransactionStats,
} from "./get-transaction-stats";
import { getTransactionStats } from "./get-transaction-stats";

export type ExpenseCategoryStat = TransactionCategoryStat;
export type ExpenseMonthStat = TransactionMonthStat;
export type ExpenseCurrencyStats = TransactionCurrencyStats;
export type ExpenseStats = Omit<TransactionStats, "kind">;

export async function getExpenseStats(
  userId: string,
  filters: TransactionFilters = {},
): Promise<ExpenseStats> {
  const stats = await getTransactionStats(userId, "EXPENSE", filters);
  return { byCurrency: stats.byCurrency };
}
