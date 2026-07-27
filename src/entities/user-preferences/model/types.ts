import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";

export type UserPreferences = {
  defaultWalletId: string | null;
  defaultMoneyType: MoneyType | null;
  defaultKind: TransactionKind | null;
};

export const EMPTY_USER_PREFERENCES: UserPreferences = {
  defaultWalletId: null,
  defaultMoneyType: null,
  defaultKind: null,
};
