"use client";

import { useState } from "react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { Button } from "@/shared/ui";
import { Dialog, DialogOnCloseContext } from "@/shared/ui/dialog";
import {
  TransactionForm,
  TransactionFormSuccessContext,
} from "./transaction-form";

type CreateTransactionDialogProps = {
  wallets: WalletOption[];
  categories: CategoryOption[];
};

export function CreateTransactionDialog({
  wallets,
  categories,
}: CreateTransactionDialogProps) {
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => setFormKey((key) => key + 1);

  if (wallets.length === 0) {
    return (
      <Button type="button" className="w-auto" disabled>
        Добавить операцию
      </Button>
    );
  }

  return (
    <DialogOnCloseContext.Provider value={resetForm}>
      <Dialog
        trigger={
          <Button type="button" className="w-auto">
            Добавить операцию
          </Button>
        }
        title="Новая операция"
      >
        {({ close }) => (
          <TransactionFormSuccessContext.Provider
            value={() => {
              close();
              resetForm();
            }}
          >
            <TransactionForm
              key={formKey}
              wallets={wallets}
              categories={categories}
            />
          </TransactionFormSuccessContext.Provider>
        )}
      </Dialog>
    </DialogOnCloseContext.Provider>
  );
}
