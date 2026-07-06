"use client";

import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";
import { Button } from "@/shared/ui";
import { Dialog } from "@/shared/ui/dialog";
import {
  TransactionForm,
  TransactionFormSuccessContext,
  type TransactionFormValues,
} from "./transaction-form";

export type EditableTransaction = {
  id: string;
  kind: TransactionKind;
  moneyType: MoneyType;
  amount: string;
  description: string | null;
  occurredAt: string;
};

function toFormValues(transaction: EditableTransaction): TransactionFormValues {
  return {
    kind: transaction.kind,
    moneyType: transaction.moneyType,
    amount: Number(transaction.amount),
    description: transaction.description ?? "",
    occurredAt: new Date(transaction.occurredAt),
  };
}

type EditTransactionDialogProps = {
  transaction: EditableTransaction;
};

export function EditTransactionDialog({ transaction }: EditTransactionDialogProps) {
  return (
    <Dialog
      trigger={
        <Button type="button" className="w-auto">
          Изменить
        </Button>
      }
      title="Редактировать операцию"
    >
      {({ close }) => (
        <TransactionFormSuccessContext.Provider value={close}>
          <TransactionForm
            key={transaction.id}
            mode="edit"
            transactionId={transaction.id}
            defaultValues={toFormValues(transaction)}
          />
        </TransactionFormSuccessContext.Provider>
      )}
    </Dialog>
  );
}
