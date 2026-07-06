import type { Transaction } from "@/src/generated/prisma/client";
import { TRANSACTIONS_PAGE_SIZE } from "../config/constants";

type TransactionsPageData =
  | {
      transactions: Transaction[];
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
): Promise<TransactionsPageData> {
  const { prisma } = await import("@/src/lib/prisma");

  try {
    const total = await prisma.transaction.count({ where: { userId } });
    const totalPages = Math.max(1, Math.ceil(total / TRANSACTIONS_PAGE_SIZE));
    const page = total > 0 ? Math.min(requestedPage, totalPages) : 1;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      take: TRANSACTIONS_PAGE_SIZE,
      skip: (page - 1) * TRANSACTIONS_PAGE_SIZE,
      orderBy: {
        occurredAt: "desc",
      },
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
