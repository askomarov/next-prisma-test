import type { User } from "@/src/generated/prisma/client";
import { USERS_PAGE_SIZE } from "../config/constants";
import { buildUsersWhere } from "../lib/build-users-where";

type UsersPageData =
  | {
      users: User[];
      total: number;
      page: number;
      totalPages: number;
    }
  | {
      users: undefined;
      total: undefined;
      page: number;
      totalPages: number;
    };

export async function getUsersPage(
  requestedPage: number,
  search: string,
): Promise<UsersPageData> {
  const { prisma } = await import("@/src/lib/prisma");
  const where = buildUsersWhere(search);

  try {
    const total = await prisma.user.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
    const page = total > 0 ? Math.min(requestedPage, totalPages) : 1;

    const users = await prisma.user.findMany({
      where,
      take: USERS_PAGE_SIZE,
      skip: (page - 1) * USERS_PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { users, total, page, totalPages };
  } catch {
    return {
      users: undefined,
      total: undefined,
      page: requestedPage,
      totalPages: 1,
    };
  }
}
