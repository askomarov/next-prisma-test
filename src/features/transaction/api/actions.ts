"use server";

import { requireAuthUserId } from "@/src/lib/auth/guards";
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
