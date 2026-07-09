"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import {
  MONEY_TYPE_LABELS,
  TRANSACTION_KIND_LABELS,
  buildTransactionStatsUrl,
  buildTransactionsUrl,
  type TransactionFilters,
} from "@/entities/transaction";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/shared/lib/utils";
import { Button, Select } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover/popover";

type TransactionFiltersProps = {
  filters: TransactionFilters;
  wallets: WalletOption[];
  categories: CategoryOption[];
  target?: "transactions" | "stats";
};

type FilterState = {
  kind: string;
  moneyType: string;
  walletId: string;
  categoryId: string;
  from: string;
  to: string;
};

function toFilterState(filters: TransactionFilters): FilterState {
  return {
    kind: filters.kind ?? "",
    moneyType: filters.moneyType ?? "",
    walletId: filters.walletId ?? "",
    categoryId: filters.categoryId ?? "",
    from: filters.from ?? "",
    to: filters.to ?? "",
  };
}

function toTransactionFilters(state: FilterState): TransactionFilters {
  return {
    kind:
      state.kind === "INCOME" || state.kind === "EXPENSE"
        ? state.kind
        : undefined,
    moneyType:
      state.moneyType === "REAL" || state.moneyType === "VIRTUAL"
        ? state.moneyType
        : undefined,
    walletId: state.walletId || undefined,
    categoryId: state.categoryId || undefined,
    from: state.from || undefined,
    to: state.to || undefined,
  };
}

function formatRangeLabel(range: DateRange | undefined) {
  if (!range?.from && !range?.to) return "Выберите даты";

  const fmt = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" });
  const from = range.from ? fmt.format(range.from) : "…";
  const to = range.to ? fmt.format(range.to) : "…";

  return `${from} — ${to}`;
}

function toDateOnly(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return undefined;
  }
  return date;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function TransactionFilters({
  filters,
  wallets,
  categories,
  target = "transactions",
}: TransactionFiltersProps) {
  const router = useRouter();
  const [state, setState] = useState<FilterState>(() => toFilterState(filters));

  useEffect(() => {
    setState(toFilterState(filters));
  }, [
    filters.kind,
    filters.moneyType,
    filters.walletId,
    filters.categoryId,
    filters.from,
    filters.to,
  ]);

  const updateFilter = (patch: Partial<FilterState>) => {
    const nextState = { ...state, ...patch };
    setState(nextState);

    const nextFilters = toTransactionFilters(nextState);

    router.replace(
      target === "stats"
        ? buildTransactionStatsUrl(nextFilters)
        : buildTransactionsUrl({ page: 1, ...nextFilters }),
    );
  };

  const resetFilters = () => {
    setState({
      kind: "",
      moneyType: "",
      walletId: "",
      categoryId: "",
      from: "",
      to: "",
    });
    router.replace(
      target === "stats"
        ? buildTransactionStatsUrl({})
        : buildTransactionsUrl({ page: 1 }),
    );
  };

  const hasActiveFilters = Boolean(
    state.kind ||
    state.moneyType ||
    state.walletId ||
    state.categoryId ||
    state.from ||
    state.to,
  );

  const filteredCategories = state.kind
    ? categories.filter((category) => category.kind === state.kind)
    : categories;

  return (
    <div className="mb-3 flex flex-wrap gap-3 p-3 bg-card border border-border rounded-lg">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start gap-2",
                !state.from && !state.to && "text-neutral-500",
              )}
            >
              <CalendarIcon className="size-4" />
              {formatRangeLabel({
                from: state.from ? parseDateOnly(state.from) : undefined,
                to: state.to ? parseDateOnly(state.to) : undefined,
              })}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0 gap-0">
          <div className="flex flex-wrap gap-2 p-3 pb-0">
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={() =>
                updateFilter({
                  from: toDateOnly(daysAgo(6)),
                  to: toDateOnly(new Date()),
                })
              }
            >
              7 дней
            </Button>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={() =>
                updateFilter({
                  from: toDateOnly(daysAgo(29)),
                  to: toDateOnly(new Date()),
                })
              }
            >
              30 дней
            </Button>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={() =>
                updateFilter({
                  from: toDateOnly(startOfYear(new Date())),
                  to: toDateOnly(new Date()),
                })
              }
            >
              YTD
            </Button>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={() =>
                updateFilter({
                  from: toDateOnly(startOfMonth(new Date())),
                  to: toDateOnly(new Date()),
                })
              }
            >
              Этот месяц
            </Button>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => updateFilter({ from: "", to: "" })}
              disabled={!state.from && !state.to}
            >
              Сброс
            </Button>
          </div>
          <Calendar
            mode="range"
            numberOfMonths={2}
            showOutsideDays={false}
            disabled={{ after: new Date() }}
            selected={{
              from: state.from ? parseDateOnly(state.from) : undefined,
              to: state.to ? parseDateOnly(state.to) : undefined,
            }}
            onSelect={(range) => {
              updateFilter({
                from: range?.from ? toDateOnly(range.from) : "",
                to: range?.to ? toDateOnly(range.to) : "",
              });
            }}
          />
        </PopoverContent>
      </Popover>

      <Select
        value={state.kind}
        onChange={(event) => updateFilter({ kind: event.target.value })}
        aria-label="Фильтр по типу транзакции"
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
