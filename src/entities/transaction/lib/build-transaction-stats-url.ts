import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";

const TRANSACTION_STATS_BASE_PATH = "/finance/stats";

type TransactionStatsQueryParams = {
  kind?: TransactionKind;
  moneyType?: MoneyType;
  walletId?: string;
  categoryId?: string;
  from?: string;
  to?: string;
};

export function buildTransactionStatsUrl({
  kind,
  moneyType,
  walletId,
  categoryId,
  from,
  to,
}: TransactionStatsQueryParams) {
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

  const query = params.toString();
  return query
    ? `${TRANSACTION_STATS_BASE_PATH}?${query}`
    : TRANSACTION_STATS_BASE_PATH;
}

export { TRANSACTION_STATS_BASE_PATH };

