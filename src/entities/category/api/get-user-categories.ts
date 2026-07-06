import { DEFAULT_CATEGORIES } from "../config/defaults";
import type { CategoryListItem, CategoryOption } from "../model/types";

export async function ensureDefaultCategories(userId: string): Promise<void> {
  const { prisma } = await import("@/src/lib/prisma");

  const count = await prisma.category.count({ where: { userId } });

  if (count > 0) {
    return;
  }

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({
      userId,
      name: category.name,
      kind: category.kind,
    })),
    skipDuplicates: true,
  });
}

export async function getUserCategoryOptions(
  userId: string,
): Promise<CategoryOption[]> {
  await ensureDefaultCategories(userId);
  const { prisma } = await import("@/src/lib/prisma");

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: [{ kind: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      kind: true,
    },
  });

  return categories;
}

export async function getUserCategoryList(
  userId: string,
): Promise<CategoryListItem[]> {
  await ensureDefaultCategories(userId);
  const { prisma } = await import("@/src/lib/prisma");

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: [{ kind: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    kind: category.kind,
    transactionCount: category._count.transactions,
  }));
}
