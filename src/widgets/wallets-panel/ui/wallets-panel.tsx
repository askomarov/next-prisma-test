"use client";

import type { WalletListItem } from "@/entities/wallet";
import { CURRENCY_LABELS, isSupportedCurrency } from "@/entities/wallet";
import {
  CreateWalletDialog,
  DeleteWalletButton,
  EditWalletDialog,
} from "@/features/wallet";
import {
  walletActionsVariants,
  walletCurrencyVariants,
  walletItemVariants,
  walletMetaVariants,
  walletsListVariants,
} from "./wallets-panel.variants";

type WalletListItemRowProps = {
  wallet: WalletListItem;
};

function getCurrencyLabel(currency: string) {
  return isSupportedCurrency(currency)
    ? CURRENCY_LABELS[currency]
    : currency;
}

export function WalletListItemRow({ wallet }: WalletListItemRowProps) {
  return (
    <li className={walletItemVariants()}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{wallet.name}</strong>
          <span className={walletCurrencyVariants()}>
            {getCurrencyLabel(wallet.currency)}
          </span>
        </div>
        {wallet.description ? (
          <p className={walletMetaVariants()}>{wallet.description}</p>
        ) : null}
      </div>
      <div className={walletActionsVariants()}>
        <EditWalletDialog wallet={wallet} />
        <DeleteWalletButton wallet={wallet} />
      </div>
    </li>
  );
}

type WalletsListProps = {
  wallets: WalletListItem[];
};

export function WalletsList({ wallets }: WalletsListProps) {
  return (
    <ul className={walletsListVariants()}>
      {wallets.map((wallet) => (
        <WalletListItemRow key={wallet.id} wallet={wallet} />
      ))}
    </ul>
  );
}

export function WalletsPanelActions() {
  return <CreateWalletDialog />;
}
