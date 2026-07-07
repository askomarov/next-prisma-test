"use client";

import { useMemo, useState } from "react";

import type { TransactionCurrencyStats } from "@/entities/transaction";
import { formatMoney } from "@/entities/wallet";
import { Button } from "@/shared/ui/button/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card/card";
import { cn } from "@/shared/lib/utils";
import { TransactionKindCharts } from "./expense-stats-charts";
import { expenseStatsSummaryGridVariants } from "./expense-stats.variants";

type TransactionStatsDashboardProps = {
  expense: TransactionCurrencyStats[];
  income: TransactionCurrencyStats[];
};

type TabId = "summary" | "expense" | "income";

function mergeCurrencies(
  income: TransactionCurrencyStats[],
  expense: TransactionCurrencyStats[],
) {
  const currencySet = new Set<string>([
    ...income.map((item) => item.currency),
    ...expense.map((item) => item.currency),
  ]);

  const incomeByCurrency = new Map(income.map((item) => [item.currency, item]));
  const expenseByCurrency = new Map(
    expense.map((item) => [item.currency, item]),
  );

  return [...currencySet]
    .map((currency) => {
      const incomeStats = incomeByCurrency.get(currency);
      const expenseStats = expenseByCurrency.get(currency);

      const incomeTotal = incomeStats?.total ?? 0;
      const expenseTotal = expenseStats?.total ?? 0;
      const net = incomeTotal - expenseTotal;

      return {
        currency,
        incomeTotal,
        expenseTotal,
        net,
        incomeCount: incomeStats?.count ?? 0,
        expenseCount: expenseStats?.count ?? 0,
      };
    })
    .sort((left, right) => Math.abs(right.net) - Math.abs(left.net));
}

function SummaryCards({
  currency,
  incomeTotal,
  expenseTotal,
  net,
}: {
  currency: string;
  incomeTotal: number;
  expenseTotal: number;
  net: number;
}) {
  return (
    <div className={expenseStatsSummaryGridVariants()}>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Доходы</CardDescription>
          <CardTitle className="text-lg tabular-nums">
            {formatMoney(incomeTotal, currency, "INCOME")}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Расходы</CardDescription>
          <CardTitle className="text-lg tabular-nums">
            {formatMoney(expenseTotal, currency, "EXPENSE")}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Разница</CardDescription>
          <CardTitle
            className={cn(
              "text-lg tabular-nums",
              net >= 0 ? "text-green-700" : "text-red-700",
            )}
          >
            {net >= 0
              ? formatMoney(net, currency, "INCOME")
              : formatMoney(Math.abs(net), currency, "EXPENSE")}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function TransactionStatsDashboard({
  expense,
  income,
}: TransactionStatsDashboardProps) {
  const [tab, setTab] = useState<TabId>("summary");

  const summary = useMemo(
    () => mergeCurrencies(income, expense),
    [income, expense],
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "summary"} onClick={() => setTab("summary")}>
          Сводка
        </TabButton>
        <TabButton active={tab === "expense"} onClick={() => setTab("expense")}>
          Расходы
        </TabButton>
        <TabButton active={tab === "income"} onClick={() => setTab("income")}>
          Доходы
        </TabButton>
      </div>

      {tab === "summary" ? (
        <div className="grid gap-4">
          {summary.map((item) => (
            <section key={item.currency} className="grid gap-3">
              <h3 className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                {item.currency}
              </h3>
              <SummaryCards
                currency={item.currency}
                incomeTotal={item.incomeTotal}
                expenseTotal={item.expenseTotal}
                net={item.net}
              />
            </section>
          ))}
        </div>
      ) : null}

      {tab === "expense" ? (
        <TransactionKindCharts kind="EXPENSE" stats={expense} />
      ) : null}

      {tab === "income" ? (
        <TransactionKindCharts kind="INCOME" stats={income} />
      ) : null}
    </div>
  );
}
