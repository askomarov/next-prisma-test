"use client";

import { useState, useTransition } from "react";
import type { WalletListItem } from "@/entities/wallet";
import { DeleteButton } from "@/shared/ui/delete-button";
import { deleteWallet } from "../api/actions";

type DeleteWalletButtonProps = {
  wallet: WalletListItem;
};

export function DeleteWalletButton({ wallet }: DeleteWalletButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !window.confirm(
        `Удалить кошелёк «${wallet.name}»? Это действие нельзя отменить.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await deleteWallet(wallet.id);

      if ("error" in result) {
        setError(result.error);
      }
    });
  };

  return (
    <DeleteButton
      onDelete={handleDelete}
      isPending={isPending}
      error={error}
      blockedHint={
        wallet.transactionCount > 0
          ? `Есть транзакции (${wallet.transactionCount})`
          : undefined
      }
    />
  );
}
