"use client";

import type { WalletListItem } from "@/entities/wallet";
import { CURRENCY_LABELS, isSupportedCurrency } from "@/entities/wallet";
import { Button } from "@/shared/ui";
import { Dialog } from "@/shared/ui/dialog";
import { WalletForm, WalletFormSuccessContext } from "./wallet-form";

type EditWalletDialogProps = {
  wallet: WalletListItem;
};

export function EditWalletDialog({ wallet }: EditWalletDialogProps) {
  const currencyLabel = isSupportedCurrency(wallet.currency)
    ? CURRENCY_LABELS[wallet.currency]
    : wallet.currency;

  return (
    <Dialog
      trigger={
        <Button type="button" className="w-auto">
          Изменить
        </Button>
      }
      title="Редактировать кошелёк"
    >
      {({ close }) => (
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
      )}
    </Dialog>
  );
}
