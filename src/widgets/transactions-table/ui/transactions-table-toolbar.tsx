"use client";

import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import type { TransactionFilters as TransactionFiltersState } from "@/entities/transaction";
import { CreateTransactionDialog } from "@/features/transaction";
import { TransactionFilters } from "@/features/transaction/filter";
import { transactionsToolbarVariants } from "./transactions-table.variants";

type TransactionsTableToolbarProps = {
  wallets: WalletOption[];
  categories: CategoryOption[];
  filters: TransactionFiltersState;
};

export function TransactionsTableToolbar({
  wallets,
  categories,
  filters,
}: TransactionsTableToolbarProps) {
  return (
    <div className={transactionsToolbarVariants()}>
      <CreateTransactionDialog wallets={wallets} categories={categories} />
      <TransactionFilters
        filters={filters}
        wallets={wallets}
        categories={categories}
      />
    </div>
  );
}
