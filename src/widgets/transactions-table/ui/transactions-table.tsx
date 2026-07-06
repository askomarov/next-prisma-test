import type { Transaction } from "@/src/generated/prisma/client";
import type { EditableTransaction } from "@/features/transaction";
import { getTransactionsPage } from "@/entities/transaction/server";
import { EmptyState, Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { TransactionListItem } from "./transaction-list-item";
import { TransactionPagination } from "./transaction-pagination";
import {
  inlineCodeVariants,
  transactionsListVariants,
} from "./transactions-table.variants";

type TransactionsTableProps = {
  page: number;
};

function toEditableTransaction(transaction: Transaction): EditableTransaction {
  return {
    id: transaction.id,
    kind: transaction.kind,
    moneyType: transaction.moneyType,
    amount: transaction.amount.toString(),
    description: transaction.description,
    occurredAt: transaction.occurredAt.toISOString(),
  };
}

export async function TransactionsTable({ page: requestedPage }: TransactionsTableProps) {
  const { userId } = await requireAuthUserId();
  const { transactions, total, page, totalPages } = await getTransactionsPage(
    userId,
    requestedPage,
  );

  return (
    <Panel
      title="Операции"
      meta={
        <>
          {total ?? 0} записей
          {total !== undefined && total > 0 && ` · стр. ${page}/${totalPages}`}
        </>
      }
    >
      {!transactions ? (
        <EmptyState>
          Не удалось загрузить операции. Запустите{" "}
          <code className={inlineCodeVariants()}>db:push</code>, затем обновите
          страницу.
        </EmptyState>
      ) : transactions.length === 0 ? (
        <EmptyState className="text-center">
          Записей пока нет. Добавьте первую операцию выше.
        </EmptyState>
      ) : (
        <>
          <ul className={transactionsListVariants()}>
            {transactions.map((transaction) => (
              <TransactionListItem
                key={transaction.id}
                transaction={toEditableTransaction(transaction)}
              />
            ))}
          </ul>

          <TransactionPagination page={page} totalPages={totalPages} />
        </>
      )}
    </Panel>
  );
}
