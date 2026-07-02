import Link from "next/link";
import { buildUsersUrl } from "./users-query";

type UserPaginationProps = {
  page: number;
  totalPages: number;
  search?: string;
};

export default function UserPagination({
  page,
  totalPages,
  search,
}: UserPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="pagination" aria-label="Users pagination">
      {hasPrev ? (
        <Link
          className="paginationLink"
          href={buildUsersUrl({ page: page - 1, search })}
        >
          ← Back
        </Link>
      ) : (
        <span className="paginationDisabled">← Back</span>
      )}

      <span className="paginationInfo">
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          className="paginationLink"
          href={buildUsersUrl({ page: page + 1, search })}
        >
          Forward →
        </Link>
      ) : (
        <span className="paginationDisabled">Forward →</span>
      )}
    </nav>
  );
}
