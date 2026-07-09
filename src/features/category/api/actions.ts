"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { revalidateFinancePaths } from "@/shared/lib/revalidate-finance";
import {
  categorySchema,
  categoryUpdateSchema,
  type CategoryField,
  type CategoryInput,
  type CategoryUpdateField,
  type CategoryUpdateInput,
} from "../model/schema";

type CategoryResult =
  | { success: true }
  | { error: string; field?: CategoryField | CategoryUpdateField };

function mapCategoryError(error: unknown): CategoryResult {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      error: "Категория с таким названием уже есть для этого типа",
      field: "name",
    };
  }

  return { error: "Не удалось сохранить категорию" };
}

export async function createCategory(
  input: CategoryInput,
): Promise<CategoryResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as CategoryField | undefined,
    };
  }

  const { name, kind } = parsed.data;

  try {
    await prisma.category.create({
      data: { userId, name, kind },
    });
  } catch (error) {
    return mapCategoryError(error);
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}

export async function updateCategory(
  categoryId: string,
  input: CategoryUpdateInput,
): Promise<CategoryResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const parsed = categoryUpdateSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as CategoryUpdateField | undefined,
    };
  }

  const existing = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!existing) {
    return { error: "Категория не найдена" };
  }

  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { name: parsed.data.name },
    });
  } catch (error) {
    return mapCategoryError(error);
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}

export async function deleteCategory(
  categoryId: string,
): Promise<CategoryResult> {
  let userId: string;

  try {
    ({ userId } = await requireAuthUserId());
  } catch {
    return { error: "Unauthorized" };
  }

  const existing = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!existing) {
    return { error: "Категория не найдена" };
  }

  if (existing._count.transactions > 0) {
    return { error: "Нельзя удалить категорию с транзакциями" };
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
  } catch {
    return { error: "Не удалось удалить категорию" };
  }

  revalidateFinancePaths(revalidatePath);
  return { success: true };
}
