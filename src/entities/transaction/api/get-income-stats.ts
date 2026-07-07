import type { TransactionFilters } from "../lib/build-transactions-where";
import type {
  TransactionCategoryStat,
  TransactionCurrencyStats,
  TransactionMonthStat,
  TransactionStats,
} from "./get-transaction-stats";
import { getTransactionStats } from "./get-transaction-stats";

export type IncomeCategoryStat = TransactionCategoryStat;
export type IncomeMonthStat = TransactionMonthStat;
export type IncomeCurrencyStats = TransactionCurrencyStats;
export type IncomeStats = Omit<TransactionStats, "kind">;

export async function getIncomeStats(
  userId: string,
  filters: TransactionFilters = {},
): Promise<IncomeStats> {
  const stats = await getTransactionStats(userId, "INCOME", filters);
  return { byCurrency: stats.byCurrency };
}

