"use client";

import { useState, useTransition } from "react";
import type { WalletListItem } from "@/entities/wallet";
import { Button } from "@/shared/ui";
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
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        className="w-auto"
        loading={isPending}
        loadingText="Удаление..."
        onClick={handleDelete}
        disabled={wallet.transactionCount > 0}
      >
        Удалить
      </Button>
      {wallet.transactionCount > 0 ? (
        <span className="text-xs text-neutral-400">
          Есть операции ({wallet.transactionCount})
        </span>
      ) : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
