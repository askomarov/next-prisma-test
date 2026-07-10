"use client";

import { useContext } from "react";
import { formatMoney } from "@/entities/wallet";
import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
} from "@/entities/transaction";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { PenSquareIcon } from "lucide-react";
import type { EditableTransaction } from "../model/editable-transaction";
import { TransactionEditContext } from "./transaction-edit-context";

type TransactionListItemProps = {
  transaction: EditableTransaction;
  isEditing: boolean;
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
  }).format(new Date(isoDate));
}

export function TransactionListItem({
  transaction,
  isEditing,
}: TransactionListItemProps) {
  const editContext = useContext(TransactionEditContext);

  return (
    <li className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2.5 max-sm:flex-col max-sm:items-start">
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
          <p className="mt-0.5 text-sm text-neutral-500">
            {transaction.description}
          </p>
        ) : null}
      </div>
      <div className="flex items-end gap-3 max-sm:w-full max-sm:flex-col max-sm:items-start">
        <div className="flex flex-col items-end gap-1 max-sm:items-start">
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              transaction.kind === "INCOME"
                ? "text-success"
                : "text-destructive",
            )}
          >
            {formatMoney(
              transaction.amount,
              transaction.walletCurrency,
              transaction.kind,
            )}
          </span>
          <time
            className="text-xs whitespace-nowrap text-neutral-400"
            dateTime={transaction.occurredAt}
          >
            {formatDate(transaction.occurredAt)}
          </time>
        </div>
        <Button
          type="button"
          className="w-auto"
          aria-pressed={isEditing}
          onClick={() =>
            editContext?.setEditingTransactionId(transaction.id)
          }
        >
          <PenSquareIcon />
        </Button>
      </div>
    </li>
  );
}
