"use server";

import { revalidatePath } from "next/cache";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { prisma } from "@/src/lib/prisma";
import { revalidateFinancePaths } from "@/shared/lib/revalidate-finance";
import {
  userPreferencesSchema,
  type UserPreferencesField,
  type UserPreferencesInput,
} from "../model/schema";

type UserPreferencesResult =
  | { success: true }
  | { error: string; field?: UserPreferencesField };

function toNullableEnum<T extends string>(value: T | "" | undefined): T | null {
  return value ? value : null;
}

export async function updateUserPreferences(
  input: UserPreferencesInput,
): Promise<UserPreferencesResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = userPreferencesSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as UserPreferencesField | undefined,
    };
  }

  const defaultWalletId = parsed.data.defaultWalletId || null;
  const defaultMoneyType = toNullableEnum(parsed.data.defaultMoneyType);
  const defaultKind = toNullableEnum(parsed.data.defaultKind);

  if (defaultWalletId) {
    const wallet = await prisma.wallet.findFirst({
      where: { id: defaultWalletId, userId },
      select: { id: true },
    });

    if (!wallet) {
      return { error: "Кошелёк не найден", field: "defaultWalletId" };
    }
  }

  try {
    await prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        defaultWalletId,
        defaultMoneyType,
        defaultKind,
      },
      update: {
        defaultWalletId,
        defaultMoneyType,
        defaultKind,
      },
    });
  } catch {
    return { error: "Не удалось сохранить настройки" };
  }

  revalidatePath("/account");
  revalidateFinancePaths(revalidatePath);
  return { success: true };
}
