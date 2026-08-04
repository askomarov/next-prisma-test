"use server";

import { revalidatePath } from "next/cache";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { prisma } from "@/src/lib/prisma";
import { revalidateFinancePaths } from "@/shared/lib/revalidate-finance";
import type { TransactionInput } from "../model/schema";
import {
  saveTransaction,
  type TransactionResult,
} from "./save-transaction";

export async function createTransaction(
  input: TransactionInput,
): Promise<TransactionResult> {
  try {
    const { userId } = await requireAuthUserId();
    return saveTransaction(userId, input);
  } catch {
    return { error: "Unauthorized" };
  }
}

export async function updateTransaction(
  transactionId: string,
  input: TransactionInput,
): Promise<TransactionResult> {
  try {
    const { userId } = await requireAuthUserId();
    return saveTransaction(userId, input, transactionId);
  } catch {
    return { error: "Unauthorized" };
  }
}

export async function deleteTransaction(
  transactionId: string,
): Promise<TransactionResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    select: { id: true },
  });

  if (!existing) {
    return { error: "Транзакция не найдена" };
  }

  try {
    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  } catch {
    return { error: "Не удалось удалить транзакцию" };
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}
