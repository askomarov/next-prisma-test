"use client";

import { useMemo, useState } from "react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import {
  TransactionForm,
  TransactionFormSuccessContext,
  type TransactionFormValues,
} from "@/features/transaction";
import { Dialog, DialogOpenContext } from "@/shared/ui/dialog";
import type { EditableTransaction } from "../model/editable-transaction";
import { TransactionEditContext } from "./transaction-edit-context";
import { TransactionListItem } from "./transaction-list-item";

type EditTransactionDialogProps = {
  transaction: EditableTransaction | null;
  wallets: WalletOption[];
  categories: CategoryOption[];
  onClose: () => void;
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

function EditTransactionDialog({
  transaction,
  wallets,
  categories,
  onClose,
}: EditTransactionDialogProps) {
  return (
    <DialogOpenContext.Provider
      value={{
        open: transaction !== null,
        setOpen: (next) => {
          if (!next) onClose();
        },
      }}
    >
      <Dialog title="Редактировать транзакцию">
        {({ close }) =>
          transaction ? (
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
          ) : null
        }
      </Dialog>
    </DialogOpenContext.Provider>
  );
}

type TransactionsListProps = {
  transactions: EditableTransaction[];
  wallets: WalletOption[];
  categories: CategoryOption[];
};

export function TransactionsList({
  transactions,
  wallets,
  categories,
}: TransactionsListProps) {
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);

  const editingTransaction = useMemo(
    () =>
      editingTransactionId
        ? (transactions.find(
            (transaction) => transaction.id === editingTransactionId,
          ) ?? null)
        : null,
    [editingTransactionId, transactions],
  );

  return (
    <TransactionEditContext.Provider
      value={{ editingTransactionId, setEditingTransactionId }}
    >
      <ul className="m-0 grid list-none gap-2 p-0">
        {transactions.map((transaction) => (
          <TransactionListItem
            key={transaction.id}
            transaction={transaction}
            isEditing={editingTransactionId === transaction.id}
          />
        ))}
      </ul>

      <EditTransactionDialog
        transaction={editingTransaction}
        wallets={wallets}
        categories={categories}
        onClose={() => setEditingTransactionId(null)}
      />
    </TransactionEditContext.Provider>
  );
}
