"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";

import type { TransactionCurrencyStats } from "@/entities/transaction";
import { formatMoney } from "@/entities/wallet";
import { EmptyState } from "@/shared/ui/panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/shared/ui/chart/chart";
import {
  expenseStatsChartCardVariants,
  expenseStatsChartContentVariants,
  expenseStatsChartsGridVariants,
  expenseStatsCurrencySectionVariants,
  expenseStatsCurrencyTitleVariants,
  expenseStatsSectionVariants,
  expenseStatsSummaryGridVariants,
} from "./expense-stats.variants";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

const categoryChartConfig = {
  amount: {
    label: "Сумма",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function getMonthChartConfig(kind: "INCOME" | "EXPENSE") {
  return {
    amount: {
      label: kind === "INCOME" ? "Доходы" : "Расходы",
      color: kind === "INCOME" ? "var(--chart-3)" : "var(--chart-2)",
    },
  } satisfies ChartConfig;
}

function CategoryBarShape(props: BarShapeProps) {
  const fill =
    typeof props.payload?.fill === "string"
      ? props.payload.fill
      : "var(--chart-1)";

  return <Rectangle {...props} fill={fill} radius={4} />;
}

type TransactionKindChartsProps = {
  kind: "INCOME" | "EXPENSE";
  stats: TransactionCurrencyStats[];
};

function SummaryCards({
  kind,
  stats,
}: {
  kind: "INCOME" | "EXPENSE";
  stats: TransactionCurrencyStats;
}) {
  return (
    <div className={expenseStatsSummaryGridVariants()}>
      <Card size="sm">
        <CardHeader>
          <CardDescription>
            {kind === "INCOME" ? "Всего доходов" : "Всего расходов"}
          </CardDescription>
          <CardTitle className="text-lg tabular-nums">
            {formatMoney(stats.total, stats.currency, kind)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Транзакций</CardDescription>
          <CardTitle className="text-lg tabular-nums">{stats.count}</CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Средний чек</CardDescription>
          <CardTitle className="text-lg tabular-nums">
            {formatMoney(stats.average, stats.currency, kind)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

function CategoryChart({
  kind,
  stats,
}: {
  kind: "INCOME" | "EXPENSE";
  stats: TransactionCurrencyStats;
}) {
  const chartData = stats.byCategory.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <Card className={expenseStatsChartCardVariants()}>
      <CardHeader>
        <CardTitle>По категориям</CardTitle>
        <CardDescription>
          {kind === "INCOME"
            ? "Топ доходов по категориям"
            : "Топ расходов по категориям"}
        </CardDescription>
      </CardHeader>
      <CardContent className={expenseStatsChartContentVariants()}>
        <ChartContainer
          config={categoryChartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 12 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="categoryName"
              type="category"
              tickLine={false}
              axisLine={false}
              width={96}
              tickFormatter={(value) =>
                value.length > 14 ? `${value.slice(0, 14)}…` : value
              }
            />
            <XAxis type="number" hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    formatMoney(Number(value), stats.currency, kind)
                  }
                />
              }
            />
            <Bar dataKey="amount" shape={CategoryBarShape} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MonthTrendChart({
  kind,
  stats,
}: {
  kind: "INCOME" | "EXPENSE";
  stats: TransactionCurrencyStats;
}) {
  const config = getMonthChartConfig(kind);

  return (
    <Card className={expenseStatsChartCardVariants()}>
      <CardHeader>
        <CardTitle>По месяцам</CardTitle>
        <CardDescription>Динамика за последние 6 месяцев</CardDescription>
      </CardHeader>
      <CardContent className={expenseStatsChartContentVariants()}>
        <ChartContainer
          config={config}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={stats.byMonth}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const month = payload?.[0]?.payload?.month;

                    if (typeof month !== "string") {
                      return "";
                    }

                    const [year, monthNumber] = month.split("-");
                    const date = new Date(
                      Number(year),
                      Number(monthNumber) - 1,
                      1,
                    );

                    return new Intl.DateTimeFormat("ru-RU", {
                      month: "long",
                      year: "numeric",
                    }).format(date);
                  }}
                  formatter={(value) =>
                    formatMoney(Number(value), stats.currency, kind)
                  }
                />
              }
            />
            <Area
              dataKey="amount"
              type="monotone"
              fill="var(--color-amount)"
              fillOpacity={0.25}
              stroke="var(--color-amount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CurrencyStatsSection({
  kind,
  stats,
}: {
  kind: "INCOME" | "EXPENSE";
  stats: TransactionCurrencyStats;
}) {
  return (
    <section className={expenseStatsCurrencySectionVariants()}>
      <h3 className={expenseStatsCurrencyTitleVariants()}>{stats.currency}</h3>
      <SummaryCards kind={kind} stats={stats} />
      <div className={expenseStatsChartsGridVariants()}>
        <CategoryChart kind={kind} stats={stats} />
        <MonthTrendChart kind={kind} stats={stats} />
      </div>
    </section>
  );
}

export function TransactionKindCharts({
  kind,
  stats,
}: TransactionKindChartsProps) {
  if (stats.length === 0) {
    return <EmptyState className="text-center">нет записей</EmptyState>;
  }

  return (
    <div className={expenseStatsSectionVariants()}>
      {stats.map((currencyStats) => (
        <CurrencyStatsSection
          key={currencyStats.currency}
          kind={kind}
          stats={currencyStats}
        />
      ))}
    </div>
  );
}
