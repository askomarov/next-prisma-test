import { getUsersPage } from "@/entities/user/server";
import { UserSearch } from "@/features/user/search";
import { EmptyState, Panel } from "@/shared/ui/panel";
import {
  inlineCodeVariants,
  userEmailVariants,
  userItemVariants,
  usersListVariants,
  userTimeVariants,
} from "./users-table.variants";
import { UserPagination } from "./user-pagination";

type UsersTableProps = {
  page: number;
  search: string;
};

export async function UsersTable({
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
    <Panel
      title="Пользователи"
      meta={
        <>
          {total ?? 0} всего
          {total !== undefined && total > 0 && ` · стр. ${page}/${totalPages}`}
        </>
      }
    >
      <UserSearch defaultValue={search} />

      {!users ? (
        <EmptyState>
          Не удалось получить список пользователей. Запустите{" "}
          <code className={inlineCodeVariants()}>db:migrate</code>, затем{" "}
          <code className={inlineCodeVariants()}>db:seed</code>, затем обновите
          страницу.
        </EmptyState>
      ) : users.length === 0 ? (
        <EmptyState className="text-center">
          {hasSearch
            ? `Пользователи не найдены для "${trimmedSearch}".`
            : "Пользователи пока нет. Запустите db:seed после первой миграции."}
        </EmptyState>
      ) : (
        <>
          <ul className={usersListVariants()}>
            {users.map((user) => (
              <li key={user.id} className={userItemVariants()}>
                <div>
                  <strong>{user.name ?? "Без имени"}</strong>
                  <p className={userEmailVariants()}>{user.email}</p>
                </div>
                <time
                  className={userTimeVariants()}
                  dateTime={user.createdAt.toISOString()}
                >
                  {formatter.format(user.createdAt)}
                </time>
              </li>
            ))}
          </ul>

          <UserPagination page={page} totalPages={totalPages} search={search} />
        </>
      )}
    </Panel>
  );
}
