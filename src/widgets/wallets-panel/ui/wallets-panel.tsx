"use client";

import { useState } from "react";
import type { WalletListItem } from "@/entities/wallet";
import { CURRENCY_LABELS, isSupportedCurrency } from "@/entities/wallet";
import {
  DeleteWalletButton,
  WalletForm,
  WalletFormSuccessContext,
} from "@/features/wallet";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogOpenContext } from "@/shared/ui/dialog";
import { PenSquareIcon } from "lucide-react";

type WalletListItemRowProps = {
  wallet: WalletListItem;
  onEdit: () => void;
};

function getCurrencyLabel(currency: string) {
  return isSupportedCurrency(currency)
    ? CURRENCY_LABELS[currency]
    : currency;
}

function WalletListItemRow({ wallet, onEdit }: WalletListItemRowProps) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2.5 max-sm:flex-col max-sm:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{wallet.name}</strong>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium">
            {getCurrencyLabel(wallet.currency)}
          </span>
        </div>
        {wallet.description ? (
          <p className="mt-0.5 text-sm text-neutral-500">{wallet.description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2 max-sm:w-full">
        <Button type="button" className="w-auto" onClick={onEdit}>
          <PenSquareIcon />
        </Button>
        <DeleteWalletButton wallet={wallet} />
      </div>
    </li>
  );
}

type EditWalletDialogProps = {
  wallet: WalletListItem | null;
  onClose: () => void;
};

function EditWalletDialog({ wallet, onClose }: EditWalletDialogProps) {
  const currencyLabel = wallet
    ? isSupportedCurrency(wallet.currency)
      ? CURRENCY_LABELS[wallet.currency]
      : wallet.currency
    : "";

  return (
    <DialogOpenContext.Provider
      value={{
        open: wallet !== null,
        setOpen: (next) => {
          if (!next) onClose();
        },
      }}
    >
      <Dialog title="Редактировать кошелёк">
        {({ close }) =>
          wallet ? (
            <WalletFormSuccessContext.Provider value={close}>
              <WalletForm
                key={wallet.id}
                mode="edit"
                walletId={wallet.id}
                currencyReadOnly
                currencyLabel={currencyLabel}
                defaultValues={{
                  name: wallet.name,
                  description: wallet.description ?? "",
                }}
              />
            </WalletFormSuccessContext.Provider>
          ) : null
        }
      </Dialog>
    </DialogOpenContext.Provider>
  );
}

type WalletsListProps = {
  wallets: WalletListItem[];
};

export function WalletsList({ wallets }: WalletsListProps) {
  const [editingWallet, setEditingWallet] = useState<WalletListItem | null>(
    null,
  );

  return (
    <>
      <ul className="m-0 grid list-none gap-2 p-0">
        {wallets.map((wallet) => (
          <WalletListItemRow
            key={wallet.id}
            wallet={wallet}
            onEdit={() => setEditingWallet(wallet)}
          />
        ))}
      </ul>

      <EditWalletDialog
        wallet={editingWallet}
        onClose={() => setEditingWallet(null)}
      />
    </>
  );
}
