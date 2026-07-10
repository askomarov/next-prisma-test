import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";

export type EditableTransaction = {
  id: string;
  walletId: string;
  walletName: string;
  walletCurrency: string;
  categoryId: string | null;
  categoryName: string | null;
  kind: TransactionKind;
  moneyType: MoneyType;
  amount: string;
  description: string | null;
  occurredAt: string;
};
