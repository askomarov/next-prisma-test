import Link from "next/link";
import { buildUsersUrl } from "@/entities/user";
import {
  paginationDisabledVariants,
  paginationInfoVariants,
  paginationLinkVariants,
  paginationVariants,
} from "./user-pagination.variants";

type UserPaginationProps = {
  page: number;
  totalPages: number;
  search?: string;
};

export function UserPagination({
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
    <nav className={paginationVariants()} aria-label="Users pagination">
      {hasPrev ? (
        <Link
          className={paginationLinkVariants()}
          href={buildUsersUrl({ page: page - 1, search })}
        >
          ← Back
        </Link>
      ) : (
        <span className={paginationDisabledVariants()}>← Back</span>
      )}

      <span className={paginationInfoVariants()}>
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          className={paginationLinkVariants()}
          href={buildUsersUrl({ page: page + 1, search })}
        >
          Forward →
        </Link>
      ) : (
        <span className={paginationDisabledVariants()}>Forward →</span>
      )}
    </nav>
  );
}
