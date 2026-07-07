import type { TransactionFilters } from "../lib/build-transactions-where";
import { buildTransactionsWhere } from "../lib/build-transactions-where";

const TOP_CATEGORIES = 8;
const UNCATEGORIZED_LABEL = "Без категории";
const OTHER_CATEGORY_LABEL = "Прочее";
const DEFAULT_MONTHS_COUNT = 6;
const MAX_MONTH_BUCKETS = 24;

export type TransactionCategoryStat = {
  categoryId: string | null;
  categoryName: string;
  amount: number;
};

export type TransactionMonthStat = {
  month: string;
  label: string;
  amount: number;
};

export type TransactionCurrencyStats = {
  currency: string;
  total: number;
  count: number;
  average: number;
  byCategory: TransactionCategoryStat[];
  byMonth: TransactionMonthStat[];
};

export type TransactionStats = {
  kind: "INCOME" | "EXPENSE";
  byCurrency: TransactionCurrencyStats[];
};

type TransactionRow = {
  amount: { toString(): string };
  occurredAt: Date;
  categoryId: string | null;
  category: { name: string } | null;
  wallet: { currency: string };
};

function decimalToNumber(value: { toString(): string }) {
  return Number(value.toString());
}

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function buildMonthBucketsDefault(referenceDate = new Date()) {
  const buckets: TransactionMonthStat[] = [];

  for (let offset = DEFAULT_MONTHS_COUNT - 1; offset >= 0; offset -= 1) {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - offset,
      1,
    );
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(
      date,
    );

    buckets.push({ month, label, amount: 0 });
  }

  return buckets;
}

function buildMonthBucketsForRange(
  from: Date | null,
  to: Date | null,
): TransactionMonthStat[] {
  if (!from && !to) {
    return buildMonthBucketsDefault();
  }

  const safeFrom = from ? monthStart(from) : monthStart(addMonths(new Date(), -(DEFAULT_MONTHS_COUNT - 1)));
  const safeTo = to ? monthStart(to) : monthStart(new Date());

  const start = safeFrom <= safeTo ? safeFrom : safeTo;
  const end = safeFrom <= safeTo ? safeTo : safeFrom;

  const buckets: TransactionMonthStat[] = [];
  let cursor = start;

  while (cursor <= end && buckets.length < MAX_MONTH_BUCKETS) {
    const month = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(
      cursor,
    );
    buckets.push({ month, label, amount: 0 });
    cursor = addMonths(cursor, 1);
  }

  return buckets.length > 0 ? buckets : buildMonthBucketsDefault();
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildCategoryStats(
  categoryTotals: Map<string | null, { name: string; amount: number }>,
): TransactionCategoryStat[] {
  const sorted = [...categoryTotals.entries()].sort(
    (left, right) => right[1].amount - left[1].amount,
  );

  if (sorted.length <= TOP_CATEGORIES) {
    return sorted.map(([categoryId, item]) => ({
      categoryId,
      categoryName: item.name,
      amount: item.amount,
    }));
  }

  const top = sorted.slice(0, TOP_CATEGORIES);
  const restAmount = sorted
    .slice(TOP_CATEGORIES)
    .reduce((sum, [, item]) => sum + item.amount, 0);

  return [
    ...top.map(([categoryId, item]) => ({
      categoryId,
      categoryName: item.name,
      amount: item.amount,
    })),
    {
      categoryId: null,
      categoryName: OTHER_CATEGORY_LABEL,
      amount: restAmount,
    },
  ];
}

function aggregateCurrencyStats(
  currency: string,
  transactions: TransactionRow[],
  filters: TransactionFilters,
): TransactionCurrencyStats {
  const from = filters.from ? parseDateOnly(filters.from) : null;
  const to = filters.to ? parseDateOnly(filters.to) : null;
  const monthBuckets = buildMonthBucketsForRange(from, to);
  const monthIndex = new Map(monthBuckets.map((bucket, index) => [bucket.month, index]));
  const categoryTotals = new Map<string | null, { name: string; amount: number }>();

  let total = 0;

  for (const transaction of transactions) {
    const amount = decimalToNumber(transaction.amount);
    total += amount;

    const categoryKey = transaction.categoryId;
    const categoryName = transaction.category?.name ?? UNCATEGORIZED_LABEL;
    const currentCategory = categoryTotals.get(categoryKey);

    if (currentCategory) {
      currentCategory.amount += amount;
    } else {
      categoryTotals.set(categoryKey, { name: categoryName, amount });
    }

    const monthKey = getMonthKey(transaction.occurredAt);
    const bucketIndex = monthIndex.get(monthKey);

    if (bucketIndex !== undefined) {
      monthBuckets[bucketIndex].amount += amount;
    }
  }

  const count = transactions.length;

  return {
    currency,
    total,
    count,
    average: count > 0 ? total / count : 0,
    byCategory: buildCategoryStats(categoryTotals),
    byMonth: monthBuckets,
  };
}

export async function getTransactionStats(
  userId: string,
  kind: "INCOME" | "EXPENSE",
  filters: TransactionFilters = {},
): Promise<TransactionStats> {
  if (filters.kind && filters.kind !== kind) {
    return { kind, byCurrency: [] };
  }

  const { prisma } = await import("@/src/lib/prisma");
  const where = {
    ...buildTransactionsWhere(userId, filters),
    kind,
  };

  const transactions = await prisma.transaction.findMany({
    where,
    select: {
      amount: true,
      occurredAt: true,
      categoryId: true,
      category: {
        select: {
          name: true,
        },
      },
      wallet: {
        select: {
          currency: true,
        },
      },
    },
  });

  if (transactions.length === 0) {
    return { kind, byCurrency: [] };
  }

  const byCurrencyMap = new Map<string, TransactionRow[]>();

  for (const transaction of transactions) {
    const currency = transaction.wallet.currency;
    const current = byCurrencyMap.get(currency);

    if (current) {
      current.push(transaction);
    } else {
      byCurrencyMap.set(currency, [transaction]);
    }
  }

  const byCurrency = [...byCurrencyMap.entries()]
    .map(([currency, currencyTransactions]) =>
      aggregateCurrencyStats(currency, currencyTransactions, filters),
    )
    .sort((left, right) => right.total - left.total);

  return { kind, byCurrency };
}

