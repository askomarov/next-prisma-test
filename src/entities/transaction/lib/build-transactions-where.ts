import type {
  MoneyType,
  Prisma,
  TransactionKind,
} from "@/src/generated/prisma/client";

export type TransactionFilters = {
  kind?: TransactionKind;
  moneyType?: MoneyType;
  walletId?: string;
  categoryId?: string;
};

export function buildTransactionsWhere(
  userId: string,
  filters: TransactionFilters,
): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId };

  if (filters.kind) {
    where.kind = filters.kind;
  }

  if (filters.moneyType) {
    where.moneyType = filters.moneyType;
  }

  if (filters.walletId) {
    where.walletId = filters.walletId;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  return where;
}

export function parseTransactionKind(
  value: string | undefined,
): TransactionKind | undefined {
  if (value === "INCOME" || value === "EXPENSE") {
    return value;
  }

  return undefined;
}

export function parseMoneyType(value: string | undefined): MoneyType | undefined {
  if (value === "REAL" || value === "VIRTUAL") {
    return value;
  }

  return undefined;
}
