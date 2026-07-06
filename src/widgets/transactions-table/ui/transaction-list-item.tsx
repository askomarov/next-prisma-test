"use client";

import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { formatMoney } from "@/entities/wallet";
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
  wallets: WalletOption[];
  categories: CategoryOption[];
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(isoDate));
}

export function TransactionListItem({
  transaction,
  wallets,
  categories,
}: TransactionListItemProps) {
  return (
    <li className={transactionItemVariants()}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{TRANSACTION_KIND_LABELS[transaction.kind]}</strong>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-sm">
            {MONEY_TYPE_LABELS[transaction.moneyType]}
          </span>
          <span className="text-xs text-neutral-400">·</span>
          <span className="text-sm">{transaction.walletName}</span>
          {transaction.categoryName ? (
            <>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-sm">{transaction.categoryName}</span>
            </>
          ) : null}
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
            {formatMoney(
              transaction.amount,
              transaction.walletCurrency,
              transaction.kind,
            )}
          </span>
          <time
            className={transactionDateVariants()}
            dateTime={transaction.occurredAt}
          >
            {formatDate(transaction.occurredAt)}
          </time>
        </div>
        <EditTransactionDialog
          transaction={transaction}
          wallets={wallets}
          categories={categories}
        />
      </div>
    </li>
  );
}
