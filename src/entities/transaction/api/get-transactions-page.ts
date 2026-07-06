import type { Prisma } from "@/src/generated/prisma/client";
import type { TransactionFilters } from "../lib/build-transactions-where";
import { buildTransactionsWhere } from "../lib/build-transactions-where";
import { TRANSACTIONS_PAGE_SIZE } from "../config/constants";

const transactionInclude = {
  wallet: {
    select: {
      id: true,
      name: true,
      currency: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      kind: true,
    },
  },
} as const;

export type TransactionWithWallet = Prisma.TransactionGetPayload<{
  include: typeof transactionInclude;
}>;

type TransactionsPageData =
  | {
      transactions: TransactionWithWallet[];
      total: number;
      page: number;
      totalPages: number;
    }
  | {
      transactions: undefined;
      total: undefined;
      page: number;
      totalPages: number;
    };

export async function getTransactionsPage(
  userId: string,
  requestedPage: number,
  filters: TransactionFilters = {},
): Promise<TransactionsPageData> {
  const { prisma } = await import("@/src/lib/prisma");
  const where = buildTransactionsWhere(userId, filters);

  try {
    const total = await prisma.transaction.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / TRANSACTIONS_PAGE_SIZE));
    const page = total > 0 ? Math.min(requestedPage, totalPages) : 1;

    const transactions = await prisma.transaction.findMany({
      where,
      take: TRANSACTIONS_PAGE_SIZE,
      skip: (page - 1) * TRANSACTIONS_PAGE_SIZE,
      orderBy: {
        occurredAt: "desc",
      },
      include: transactionInclude,
    });

    return { transactions, total, page, totalPages };
  } catch {
    return {
      transactions: undefined,
      total: undefined,
      page: requestedPage,
      totalPages: 1,
    };
  }
}
