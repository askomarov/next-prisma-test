import type { Prisma } from "../generated/prisma/client";
import type { User } from "../generated/prisma/client";
import UserPagination from "./user-pagination";
import UserSearch from "./user-search";

export const USERS_PAGE_SIZE = 5;

type UsersTableProps = {
  page: number;
  search: string;
};

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

function buildUsersWhere(search: string): Prisma.UserWhereInput | undefined {
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

async function getUsersPage(
  requestedPage: number,
  search: string,
): Promise<UsersPageData> {
  const { prisma } = await import("../lib/prisma");
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

export default async function UsersTable({
  page: requestedPage,
  search,
}: UsersTableProps) {
  const { users, total, page, totalPages } = await getUsersPage(
    requestedPage,
    search,
  );

  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const trimmedSearch = search.trim();
  const hasSearch = trimmedSearch.length > 0;

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Users</h2>
        <span>
          {total ?? 0} total
          {total !== undefined && total > 0 && ` · page ${page}/${totalPages}`}
        </span>
      </div>

      <UserSearch defaultValue={search} />

      {!users ? (
        <p className="empty">
          Could not query users yet. Run <code>db:migrate</code>, then{" "}
          <code>db:seed</code>, then refresh.
        </p>
      ) : users.length === 0 ? (
        <p className="empty text-center">
          {hasSearch
            ? `No users found for "${trimmedSearch}".`
            : "No users yet. Run db:seed after your first migration."}
        </p>
      ) : (
        <>
          <ul className="users">
            {users.map((user) => (
              <li key={user.id}>
                <div>
                  <strong>{user.name ?? "Unnamed user"}</strong>
                  <p>{user.email}</p>
                </div>
                <time dateTime={user.createdAt.toISOString()}>
                  {formatter.format(user.createdAt)}
                </time>
              </li>
            ))}
          </ul>

          <UserPagination page={page} totalPages={totalPages} search={search} />
        </>
      )}
    </section>
  );
}
