"use client";

import { useState } from "react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogOnCloseContext } from "@/shared/ui/dialog";
import {
  TransactionForm,
  TransactionFormSuccessContext,
} from "./transaction-form";
import { PlusCircleIcon } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

type CreateTransactionDialogProps = {
  wallets: WalletOption[];
  categories: CategoryOption[];
  label?: string;
  className?: string;
};

export function CreateTransactionDialog({
  wallets,
  categories,
  label = "Добавить",
  className,
}: CreateTransactionDialogProps) {
  const [formKey, setFormKey] = useState(0);
  const resetForm = () => setFormKey((key) => key + 1);

  if (wallets.length === 0) {
    return (
      <Button type="button" className="w-auto" disabled>
        {label} <PlusCircleIcon />
      </Button>
    );
  }

  return (
    <DialogOnCloseContext.Provider value={resetForm}>
      <Dialog
        trigger={
          <Button type="button" className={cn("w-auto", className)}>
            {label} <PlusCircleIcon />
          </Button>
        }
        title="Новая транзакция"
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
