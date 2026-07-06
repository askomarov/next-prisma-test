"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
  buildTransactionsUrl,
  type TransactionFilters,
} from "@/entities/transaction";
import { Button, Select } from "@/shared/ui";
import { transactionFiltersVariants } from "./transaction-filters.variants";

type TransactionFiltersProps = {
  filters: TransactionFilters;
  wallets: WalletOption[];
  categories: CategoryOption[];
};

type FilterState = {
  kind: string;
  moneyType: string;
  walletId: string;
  categoryId: string;
};

function toFilterState(filters: TransactionFilters): FilterState {
  return {
    kind: filters.kind ?? "",
    moneyType: filters.moneyType ?? "",
    walletId: filters.walletId ?? "",
    categoryId: filters.categoryId ?? "",
  };
}

function toTransactionFilters(state: FilterState): TransactionFilters {
  return {
    kind: state.kind === "INCOME" || state.kind === "EXPENSE" ? state.kind : undefined,
    moneyType:
      state.moneyType === "REAL" || state.moneyType === "VIRTUAL"
        ? state.moneyType
        : undefined,
    walletId: state.walletId || undefined,
    categoryId: state.categoryId || undefined,
  };
}

export function TransactionFilters({
  filters,
  wallets,
  categories,
}: TransactionFiltersProps) {
  const router = useRouter();
  const [state, setState] = useState<FilterState>(() => toFilterState(filters));

  useEffect(() => {
    setState(toFilterState(filters));
  }, [filters.kind, filters.moneyType, filters.walletId, filters.categoryId]);

  const updateFilter = (patch: Partial<FilterState>) => {
    const nextState = { ...state, ...patch };
    setState(nextState);

    router.replace(
      buildTransactionsUrl({
        page: 1,
        ...toTransactionFilters(nextState),
      }),
    );
  };

  const resetFilters = () => {
    setState({ kind: "", moneyType: "", walletId: "", categoryId: "" });
    router.replace(buildTransactionsUrl({ page: 1 }));
  };

  const hasActiveFilters = Boolean(
    state.kind || state.moneyType || state.walletId || state.categoryId,
  );

  const filteredCategories = state.kind
    ? categories.filter((category) => category.kind === state.kind)
    : categories;

  return (
    <div className={transactionFiltersVariants()}>
      <Select
        value={state.kind}
        onChange={(event) => updateFilter({ kind: event.target.value })}
        aria-label="Фильтр по типу операции"
      >
        <option value="">Все типы</option>
        {Object.entries(TRANSACTION_KIND_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        value={state.moneyType}
        onChange={(event) => updateFilter({ moneyType: event.target.value })}
        aria-label="Фильтр по типу денег"
      >
        <option value="">Все деньги</option>
        {Object.entries(MONEY_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        value={state.walletId}
        onChange={(event) => updateFilter({ walletId: event.target.value })}
        aria-label="Фильтр по кошельку"
      >
        <option value="">Все кошельки</option>
        {wallets.map((wallet) => (
          <option key={wallet.id} value={wallet.id}>
            {wallet.name} ({wallet.currency})
          </option>
        ))}
      </Select>

      <Select
        value={state.categoryId}
        onChange={(event) => updateFilter({ categoryId: event.target.value })}
        aria-label="Фильтр по категории"
      >
        <option value="">Все категории</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Button
        type="button"
        className="w-auto"
        onClick={resetFilters}
        disabled={!hasActiveFilters}
      >
        Сбросить
      </Button>
    </div>
  );
}
