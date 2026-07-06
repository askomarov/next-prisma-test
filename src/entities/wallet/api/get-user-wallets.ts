import type { Wallet } from "@/src/generated/prisma/client";
import type { WalletListItem, WalletOption } from "../model/types";

export async function getUserWallets(userId: string): Promise<Wallet[]> {
  const { prisma } = await import("@/src/lib/prisma");

  return prisma.wallet.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function getUserWalletOptions(
  userId: string,
): Promise<WalletOption[]> {
  const wallets = await getUserWallets(userId);

  return wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    currency: wallet.currency,
  }));
}

export async function getUserWalletList(
  userId: string,
): Promise<WalletListItem[]> {
  const { prisma } = await import("@/src/lib/prisma");

  const wallets = await prisma.wallet.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  return wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    currency: wallet.currency,
    description: wallet.description,
    transactionCount: wallet._count.transactions,
  }));
}
