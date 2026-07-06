import type { Prisma } from "@/src/generated/prisma/client";

export function buildUsersWhere(
  search: string,
): Prisma.UserWhereInput | undefined {
  const query = search.trim();

  if (!query) {
    return undefined;
  }

  return {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ],
  };
}
