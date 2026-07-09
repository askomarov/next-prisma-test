import type { TransactionFilters } from "@/entities/transaction";
import { getExpenseStats, getIncomeStats } from "@/entities/transaction/server";
import { EmptyState, Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { TransactionStatsDashboard } from "./expense-stats-dashboard";

type ExpenseStatsPanelProps = {
  filters?: TransactionFilters;
};

export async function ExpenseStatsPanel({
  filters = {},
}: ExpenseStatsPanelProps) {
  const { userId } = await requireAuthUserId();
  const { getUserWalletOptions } = await import("@/entities/wallet/server");

  const [expense, income, wallets] = await Promise.all([
    getExpenseStats(userId, filters),
    getIncomeStats(userId, filters),
    getUserWalletOptions(userId),
  ]);

  const isEmpty =
    expense.byCurrency.length === 0 && income.byCurrency.length === 0;

  const hasActiveFilters = Boolean(
    filters.kind ||
      filters.moneyType ||
      filters.walletId ||
      filters.categoryId ||
      filters.from ||
      filters.to,
  );

  return (
    <Panel title="Статистика">
      {isEmpty ? (
        <EmptyState className="text-center">
          {hasActiveFilters
            ? "По выбранным фильтрам записей нет."
            : wallets.length === 0
              ? "Сначала создайте кошелёк, затем добавьте операцию."
              : "Записей пока нет. Нажмите «Добавить операцию»."}
        </EmptyState>
      ) : (
        <TransactionStatsDashboard
          expense={expense.byCurrency}
          income={income.byCurrency}
        />
      )}
    </Panel>
  );
}
