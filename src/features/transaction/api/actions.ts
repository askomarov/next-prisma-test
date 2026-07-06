"use server";

import { prisma } from "@/src/lib/prisma";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { revalidatePath } from "next/cache";
import {
  transactionSchema,
  type TransactionField,
  type TransactionInput,
} from "../model/schema";

type TransactionResult =
  | { success: true }
  | { error: string; field?: TransactionField };

async function saveTransaction(
  userId: string,
  input: TransactionInput,
  transactionId?: string,
): Promise<TransactionResult> {
  const parsed = transactionSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as TransactionField | undefined,
    };
  }

  const { kind, moneyType, amount, description, occurredAt } = parsed.data;

  try {
    if (transactionId) {
      const existing = await prisma.transaction.findFirst({
        where: { id: transactionId, userId },
        select: { id: true },
      });

      if (!existing) {
        return { error: "Операция не найдена" };
      }

      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          kind,
          moneyType,
          amount,
          description: description || null,
          occurredAt,
        },
      });
    } else {
      await prisma.transaction.create({
        data: {
          userId,
          kind,
          moneyType,
          amount,
          description: description || null,
          occurredAt,
        },
      });
    }
  } catch {
    return { error: "Не удалось сохранить операцию" };
  }

  revalidatePath("/finance");
  return { success: true };
}

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
