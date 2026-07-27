import type { WalletOption } from "@/entities/wallet";
import type { UserPreferences } from "../model/types";

export type TransactionCreateDefaults = {
  walletId: string;
  kind: "INCOME" | "EXPENSE";
  moneyType: "REAL" | "VIRTUAL";
  amount: number;
  description: string;
  categoryId: string;
  occurredAt: Date;
};

export function resolveCreateDefaults(
  wallets: WalletOption[],
  preferences: UserPreferences = {
    defaultWalletId: null,
    defaultMoneyType: null,
    defaultKind: null,
  },
): TransactionCreateDefaults {
  const preferredWalletId = preferences.defaultWalletId;
  const walletId =
    preferredWalletId && wallets.some((wallet) => wallet.id === preferredWalletId)
      ? preferredWalletId
      : (wallets[0]?.id ?? "");

  return {
    walletId,
    kind: preferences.defaultKind ?? "EXPENSE",
    moneyType: preferences.defaultMoneyType ?? "REAL",
    amount: Number.NaN,
    description: "",
    categoryId: "",
    occurredAt: new Date(),
  };
}
