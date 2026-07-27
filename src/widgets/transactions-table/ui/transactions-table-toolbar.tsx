"use client";

import type { CategoryOption } from "@/entities/category";
import type { UserPreferences } from "@/entities/user-preferences";
import type { WalletOption } from "@/entities/wallet";
import type { TransactionFilters as TransactionFiltersState } from "@/entities/transaction";
import { CreateTransactionDialog } from "@/features/transaction";
import { TransactionFilters } from "@/features/transaction/filter";

type TransactionsTableToolbarProps = {
  wallets: WalletOption[];
  categories: CategoryOption[];
  preferences?: UserPreferences;
  filters: TransactionFiltersState;
};

export function TransactionsTableToolbar({
  wallets,
  categories,
  preferences,
  filters,
}: TransactionsTableToolbarProps) {
  return (
    <div className="mb-3 grid gap-3">
      <CreateTransactionDialog
        wallets={wallets}
        categories={categories}
        preferences={preferences}
      />
      <TransactionFilters
        filters={filters}
        wallets={wallets}
        categories={categories}
      />
    </div>
  );
}
