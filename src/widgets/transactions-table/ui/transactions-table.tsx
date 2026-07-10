import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import type { TransactionFilters } from "@/entities/transaction";
import type { TransactionWithWallet } from "@/entities/transaction/api/get-transactions-page";
import type { EditableTransaction } from "../model/editable-transaction";
import { getTransactionsPage } from "@/entities/transaction/server";
import { EmptyState, Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { TransactionPagination } from "./transaction-pagination";
import { TransactionsList } from "./transactions-list";
import { TransactionsTableToolbar } from "./transactions-table-toolbar";

type TransactionsTableProps = {
  page: number;
  filters?: TransactionFilters;
  wallets?: WalletOption[];
  categories?: CategoryOption[];
  toolbar?: boolean;
};

function toEditableTransaction(
  transaction: TransactionWithWallet,
): EditableTransaction {
  return {
    id: transaction.id,
    walletId: transaction.walletId,
    walletName: transaction.wallet.name,
    walletCurrency: transaction.wallet.currency,
    categoryId: transaction.categoryId,
    categoryName: transaction.category?.name ?? null,
    kind: transaction.kind,
    moneyType: transaction.moneyType,
    amount: transaction.amount.toString(),
    description: transaction.description,
    occurredAt: transaction.occurredAt.toISOString(),
  };
}

export async function TransactionsTable({
  page: requestedPage,
  filters = {},
  wallets: initialWallets,
  categories: initialCategories,
  toolbar = true,
}: TransactionsTableProps) {
  const { userId } = await requireAuthUserId();
  const { getUserWalletOptions } = await import("@/entities/wallet/server");
  const { getUserCategoryOptions } = await import("@/entities/category/server");

  const wallets = initialWallets ?? (await getUserWalletOptions(userId));
  const categories =
    initialCategories ?? (await getUserCategoryOptions(userId));
  const { transactions, total, page, totalPages } = await getTransactionsPage(
    userId,
    requestedPage,
    filters,
  );

  const hasActiveFilters = Boolean(
    filters.kind || filters.moneyType || filters.walletId || filters.categoryId,
  );

  return (
    <Panel
      title="Транзакции"
      meta={
        <>
          {total ?? 0} записей
          {total !== undefined && total > 0 && ` · стр. ${page}/${totalPages}`}
        </>
      }
    >
      {toolbar ? (
        <TransactionsTableToolbar
          wallets={wallets}
          categories={categories}
          filters={filters}
        />
      ) : null}

      {!transactions ? (
        <EmptyState>
          Не удалось загрузить транзакции. Запустите{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.875em]">
            db:push
          </code>, затем обновите
          страницу.
        </EmptyState>
      ) : transactions.length === 0 ? (
        <EmptyState className="text-center">
          {hasActiveFilters
            ? "По выбранным фильтрам записей нет."
            : wallets.length === 0
              ? "Сначала создайте кошелёк, затем добавьте транзакцию."
              : "Записей пока нет. Нажмите «Добавить»."}
        </EmptyState>
      ) : (
        <>
          <TransactionsList
            transactions={transactions.map(toEditableTransaction)}
            wallets={wallets}
            categories={categories}
          />

          <TransactionPagination
            page={page}
            totalPages={totalPages}
            filters={filters}
          />
        </>
      )}
    </Panel>
  );
}
