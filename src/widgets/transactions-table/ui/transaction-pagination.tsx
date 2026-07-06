import Link from "next/link";
import { buildTransactionsUrl } from "@/entities/transaction";
import {
  paginationDisabledVariants,
  paginationInfoVariants,
  paginationLinkVariants,
  paginationVariants,
} from "@/widgets/users-table/ui/user-pagination.variants";

type TransactionPaginationProps = {
  page: number;
  totalPages: number;
};

export function TransactionPagination({
  page,
  totalPages,
}: TransactionPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className={paginationVariants()} aria-label="Transactions pagination">
      {hasPrev ? (
        <Link
          className={paginationLinkVariants()}
          href={buildTransactionsUrl({ page: page - 1 })}
        >
          ← Назад
        </Link>
      ) : (
        <span className={paginationDisabledVariants()}>← Назад</span>
      )}

      <span className={paginationInfoVariants()}>
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          className={paginationLinkVariants()}
          href={buildTransactionsUrl({ page: page + 1 })}
        >
          Вперёд →
        </Link>
      ) : (
        <span className={paginationDisabledVariants()}>Вперёд →</span>
      )}
    </nav>
  );
}
