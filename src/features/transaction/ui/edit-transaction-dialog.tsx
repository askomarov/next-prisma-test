"use client";

import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import {
  TransactionForm,
  TransactionFormSuccessContext,
  type TransactionFormValues,
} from "./transaction-form";
import { PenSquareIcon } from "lucide-react";

export type EditableTransaction = {
  id: string;
  walletId: string;
  walletName: string;
  walletCurrency: string;
  categoryId: string | null;
  categoryName: string | null;
  kind: TransactionKind;
  moneyType: MoneyType;
  amount: string;
  description: string | null;
  occurredAt: string;
};

type EditTransactionDialogProps = {
  transaction: EditableTransaction;
  wallets: WalletOption[];
  categories: CategoryOption[];
};

function toFormValues(transaction: EditableTransaction): TransactionFormValues {
  return {
    walletId: transaction.walletId,
    kind: transaction.kind,
    moneyType: transaction.moneyType,
    amount: Number(transaction.amount),
    description: transaction.description ?? "",
    categoryId: transaction.categoryId ?? "",
    occurredAt: new Date(transaction.occurredAt),
  };
}

export function EditTransactionDialog({
  transaction,
  wallets,
  categories,
}: EditTransactionDialogProps) {
  return (
    <Dialog
      trigger={
        <Button type="button" className="w-auto">
          <PenSquareIcon />
        </Button>
      }
      title="Редактировать операцию"
    >
      {({ close }) => (
        <TransactionFormSuccessContext.Provider value={close}>
          <TransactionForm
            key={transaction.id}
            wallets={wallets}
            categories={categories}
            mode="edit"
            transactionId={transaction.id}
            defaultValues={toFormValues(transaction)}
          />
        </TransactionFormSuccessContext.Provider>
      )}
    </Dialog>
  );
}
