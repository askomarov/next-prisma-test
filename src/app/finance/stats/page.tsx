import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserWalletList } from "@/entities/wallet/server";
import {
  parseMoneyType,
  parseTransactionKind,
  type TransactionFilters,
} from "@/entities/transaction";
import { CreateTransactionDialog } from "@/features/transaction";
import { TransactionFilters as TransactionFiltersForm } from "@/features/transaction/filter";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { ExpenseStatsPanel } from "@/widgets/expense-stats";

export const dynamic = "force-dynamic";

type FinanceStatsPageProps = {
  searchParams: Promise<{
    kind?: string;
    moneyType?: string;
    walletId?: string;
    categoryId?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function FinanceStatsPage({
  searchParams,
}: FinanceStatsPageProps) {
  const { kind, moneyType, walletId, categoryId, from, to } =
    await searchParams;

  const filters: TransactionFilters = {
    kind: parseTransactionKind(kind),
    moneyType: parseMoneyType(moneyType),
    walletId: walletId || undefined,
    categoryId: categoryId || undefined,
    from: from || undefined,
    to: to || undefined,
  };

  const { userId } = await requireAuthUserId();
  const [wallets, categories] = await Promise.all([
    getUserWalletList(userId),
    getUserCategoryOptions(userId),
  ]);

  const walletOptions = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    currency: wallet.currency,
  }));

  return (
    <PageShell>
      <PageHero
        eyebrow="Финансы"
        title="Статистика"
        lede="Графики и сводка по доходам и расходам."
      />
      <div className="mb-4 grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CreateTransactionDialog
            wallets={walletOptions}
            categories={categories}
          />
        </div>
        <TransactionFiltersForm
          filters={filters}
          wallets={walletOptions}
          categories={categories}
          target="stats"
        />
      </div>
      <ExpenseStatsPanel filters={filters} />
    </PageShell>
  );
}
