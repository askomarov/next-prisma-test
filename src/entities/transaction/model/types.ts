import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";

export const TRANSACTION_KIND_LABELS: Record<TransactionKind, string> = {
  INCOME: "Приход",
  EXPENSE: "Расход",
};

export const MONEY_TYPE_LABELS: Record<MoneyType, string> = {
  REAL: "Реальные",
  VIRTUAL: "Виртуальные",
};
