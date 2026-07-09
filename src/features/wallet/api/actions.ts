"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { revalidateFinancePaths } from "@/shared/lib/revalidate-finance";
import {
  walletSchema,
  walletUpdateSchema,
  type WalletField,
  type WalletInput,
  type WalletUpdateField,
  type WalletUpdateInput,
} from "../model/schema";

type WalletResult =
  | { success: true }
  | { error: string; field?: WalletField | WalletUpdateField };

function mapWalletError(error: unknown): WalletResult {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return { error: "Кошелёк с таким именем уже есть", field: "name" };
  }

  return { error: "Не удалось сохранить кошелёк" };
}

export async function createWallet(input: WalletInput): Promise<WalletResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = walletSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as WalletField | undefined,
    };
  }

  const { name, currency, description } = parsed.data;

  try {
    await prisma.wallet.create({
      data: {
        userId,
        name,
        currency,
        description: description || null,
      },
    });
  } catch (error) {
    return mapWalletError(error);
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}

export async function updateWallet(
  walletId: string,
  input: WalletUpdateInput,
): Promise<WalletResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = walletUpdateSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as WalletUpdateField | undefined,
    };
  }

  const existing = await prisma.wallet.findFirst({
    where: { id: walletId, userId },
    select: { id: true },
  });

  if (!existing) {
    return { error: "Кошелёк не найден" };
  }

  const { name, description } = parsed.data;

  try {
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        name,
        description: description || null,
      },
    });
  } catch (error) {
    return mapWalletError(error);
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}

export async function deleteWallet(walletId: string): Promise<WalletResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const existing = await prisma.wallet.findFirst({
    where: { id: walletId, userId },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!existing) {
    return { error: "Кошелёк не найден" };
  }

  if (existing._count.transactions > 0) {
    return { error: "Нельзя удалить кошелёк с транзакциями" };
  }

  try {
    await prisma.wallet.delete({
      where: { id: walletId },
    });
  } catch {
    return { error: "Не удалось удалить кошелёк" };
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}
