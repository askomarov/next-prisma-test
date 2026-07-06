import { getUserCategoryOptions } from "@/entities/category/server";
import { getUserWalletList } from "@/entities/wallet/server";
import {
  parseMoneyType,
  parseTransactionKind,
  type TransactionFilters,
} from "@/entities/transaction";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { TransactionsTable } from "@/widgets/transactions-table";

export const dynamic = "force-dynamic";

type TransactionsPageProps = {
  searchParams: Promise<{
    page?: string;
    kind?: string;
    moneyType?: string;
    walletId?: string;
    categoryId?: string;
  }>;
};

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const { page: pageParam, kind, moneyType, walletId, categoryId } =
    await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const filters: TransactionFilters = {
    kind: parseTransactionKind(kind),
    moneyType: parseMoneyType(moneyType),
    walletId: walletId || undefined,
    categoryId: categoryId || undefined,
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
        title="Операции"
        lede="Список приходов и расходов с фильтрами по типу, деньгам, кошельку и категории."
      />

      <TransactionsTable
        page={page}
        filters={filters}
        wallets={walletOptions}
        categories={categories}
      />
    </PageShell>
  );
}
