import type { TransactionFilters } from "@/entities/transaction";
import { getExpenseStats, getIncomeStats } from "@/entities/transaction/server";
import { Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { TransactionStatsDashboard } from "./expense-stats-dashboard";

type ExpenseStatsPanelProps = {
  filters?: TransactionFilters;
};

export async function ExpenseStatsPanel({
  filters = {},
}: ExpenseStatsPanelProps) {
  const { userId } = await requireAuthUserId();
  const [expense, income] = await Promise.all([
    getExpenseStats(userId, filters),
    getIncomeStats(userId, filters),
  ]);

  if (expense.byCurrency.length === 0 && income.byCurrency.length === 0) {
    return null;
  }

  return (
    <Panel title="Статистика">
      <TransactionStatsDashboard
        expense={expense.byCurrency}
        income={income.byCurrency}
      />
    </Panel>
  );
}
