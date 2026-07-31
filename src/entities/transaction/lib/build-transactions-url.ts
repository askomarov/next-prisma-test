import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";

const TRANSACTIONS_BASE_PATH = "/finance/transactions";

type TransactionsQueryParams = {
  page?: number;
  kind?: TransactionKind;
  moneyType?: MoneyType;
  walletId?: string;
  categoryId?: string;
  query?: string;
  from?: string;
  to?: string;
};

export function buildTransactionsUrl({
  page,
  kind,
  moneyType,
  walletId,
  categoryId,
  query,
  from,
  to,
}: TransactionsQueryParams) {
  const params = new URLSearchParams();

  if (kind) {
    params.set("kind", kind);
  }

  if (moneyType) {
    params.set("moneyType", moneyType);
  }

  if (walletId) {
    params.set("walletId", walletId);
  }

  if (categoryId) {
    params.set("categoryId", categoryId);
  }

  if (from) {
    params.set("from", from);
  }

  if (to) {
    params.set("to", to);
  }

  if (query) {
    params.set("query", query);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  return qs ? `${TRANSACTIONS_BASE_PATH}?${qs}` : TRANSACTIONS_BASE_PATH;
}

export { TRANSACTIONS_BASE_PATH };
