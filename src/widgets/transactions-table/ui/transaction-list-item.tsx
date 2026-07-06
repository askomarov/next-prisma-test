"use client";

import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
} from "@/entities/transaction";
import {
  EditTransactionDialog,
  type EditableTransaction,
} from "@/features/transaction";
import {
  transactionAmountVariants,
  transactionDateVariants,
  transactionItemActionsVariants,
  transactionItemVariants,
  transactionMetaVariants,
} from "./transactions-table.variants";

type TransactionListItemProps = {
  transaction: EditableTransaction;
};

function formatAmount(amount: string, kind: "INCOME" | "EXPENSE") {
  const value = Number(amount);
  const formatted = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return kind === "INCOME" ? `+${formatted}` : `−${formatted}`;
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(isoDate));
}

export function TransactionListItem({ transaction }: TransactionListItemProps) {
  return (
    <li className={transactionItemVariants()}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{TRANSACTION_KIND_LABELS[transaction.kind]}</strong>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-sm">
            {MONEY_TYPE_LABELS[transaction.moneyType]}
          </span>
        </div>
        {transaction.description ? (
          <p className={transactionMetaVariants()}>{transaction.description}</p>
        ) : null}
      </div>
      <div className={transactionItemActionsVariants()}>
        <div className="flex flex-col items-end gap-1 max-sm:items-start">
          <span
            className={transactionAmountVariants({
              kind: transaction.kind,
            })}
          >
            {formatAmount(transaction.amount, transaction.kind)} ₽
          </span>
          <time
            className={transactionDateVariants()}
            dateTime={transaction.occurredAt}
          >
            {formatDate(transaction.occurredAt)}
          </time>
        </div>
        <EditTransactionDialog transaction={transaction} />
      </div>
    </li>
  );
}
