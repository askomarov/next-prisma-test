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
  /**
   * Inclusive date-only range in YYYY-MM-DD (ru-RU friendly).
   * Stored as string to be URL-safe; converted to Date in buildTransactionsWhere.
   */
  from?: string;
  to?: string;
};

function parseDateOnly(value: string) {
  // Expect YYYY-MM-DD; keep parsing strict to avoid TZ surprises.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(monthIndex) || !Number.isFinite(day)) {
    return null;
  }

  const date = new Date(year, monthIndex, day);
  // Guard invalid dates like 2026-02-31
  if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== day) {
    return null;
  }

  return date;
}

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

  const from = filters.from ? parseDateOnly(filters.from) : null;
  const to = filters.to ? parseDateOnly(filters.to) : null;

  if (from || to) {
    where.occurredAt = {
      ...(from ? { gte: new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0, 0) } : {}),
      ...(to ? { lte: new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999) } : {}),
    };
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
