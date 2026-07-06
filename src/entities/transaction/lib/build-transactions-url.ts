import type { MoneyType, TransactionKind } from "@/src/generated/prisma/client";

type TransactionsQueryParams = {
  page?: number;
  kind?: TransactionKind;
  moneyType?: MoneyType;
};

export function buildTransactionsUrl({
  page,
  kind,
  moneyType,
}: TransactionsQueryParams) {
  const params = new URLSearchParams();

  if (kind) {
    params.set("kind", kind);
  }

  if (moneyType) {
    params.set("moneyType", moneyType);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/finance?${query}` : "/finance";
}
