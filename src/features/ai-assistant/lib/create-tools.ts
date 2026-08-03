import "server-only";

import type { CategoryOption } from "@/entities/category";
import type { TransactionFilters } from "@/entities/transaction";
import { getTransactionStats } from "@/entities/transaction/server";
import type { WalletOption } from "@/entities/wallet";
import { saveTransaction } from "@/features/transaction/api/save-transaction";
import type { TransactionInput } from "@/features/transaction/model/schema";
import { tool, type ToolSet } from "ai";
import { z } from "zod";

const createTransactionInputSchema = z.object({
  walletId: z.string().min(1).describe("ID кошелька из списка пользователя"),
  kind: z.enum(["INCOME", "EXPENSE"]).describe("Тип операции"),
  moneyType: z
    .enum(["REAL", "VIRTUAL"])
    .describe(
      "REAL = наличные/кэш; VIRTUAL = карта/Apple Pay/Google Pay/онлайн/списание со счёта",
    ),
  amount: z.number().positive().describe("Сумма транзакции"),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .describe("Краткое описание"),
  occurredAt: z.string().describe("Дата/время операции в ISO 8601"),
  categoryId: z
    .string()
    .optional()
    .nullable()
    .describe("ID категории из списка или null"),
});

const getTransactionStatsInputSchema = z.object({
  kind: z
    .enum(["INCOME", "EXPENSE"])
    .describe("INCOME = доходы, EXPENSE = расходы/траты"),
  categoryId: z
    .string()
    .optional()
    .nullable()
    .describe("ID категории из списка; null = все категории"),
  walletId: z
    .string()
    .optional()
    .nullable()
    .describe("ID кошелька; null = все кошельки"),
  moneyType: z
    .enum(["REAL", "VIRTUAL"])
    .optional()
    .nullable()
    .describe("Фильтр типа денег; null = оба"),
  from: z
    .string()
    .optional()
    .nullable()
    .describe("Начало периода YYYY-MM-DD включительно"),
  to: z
    .string()
    .optional()
    .nullable()
    .describe("Конец периода YYYY-MM-DD включительно"),
});

type CreateAssistantToolsParams = {
  userId: string;
  wallets: WalletOption[];
  categories: CategoryOption[];
};

export function createAssistantTools({
  userId,
  wallets,
  categories,
}: CreateAssistantToolsParams) {
  const walletsById = new Map(wallets.map((wallet) => [wallet.id, wallet]));
  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );

  return {
    createTransaction: tool({
      description:
        "Создаёт транзакцию дохода или расхода. Вызывай только когда известна сумма и можно заполнить обязательные поля.",
      inputSchema: createTransactionInputSchema,
      execute: async (input) => {
        const occurredAt = new Date(input.occurredAt);

        if (Number.isNaN(occurredAt.getTime())) {
          return {
            success: false as const,
            error: "Некорректная дата occurredAt",
          };
        }

        const payload: TransactionInput = {
          walletId: input.walletId,
          kind: input.kind,
          moneyType: input.moneyType,
          amount: input.amount,
          description: input.description ?? "",
          occurredAt,
          categoryId: input.categoryId ?? "",
        };

        const result = await saveTransaction(userId, payload);

        if ("error" in result) {
          return {
            success: false as const,
            error: result.error,
            field: result.field,
          };
        }

        const wallet = walletsById.get(input.walletId);
        const category = input.categoryId
          ? categoriesById.get(input.categoryId)
          : undefined;

        return {
          success: true as const,
          kind: input.kind,
          moneyType: input.moneyType,
          amount: input.amount,
          currency: wallet?.currency ?? null,
          walletName: wallet?.name ?? null,
          categoryName: category?.name ?? null,
          description: input.description || null,
          occurredAt: occurredAt.toISOString(),
        };
      },
    }),

    getTransactionStats: tool({
      description:
        "Возвращает статистику доходов или расходов: итоги по валютам, разбивку по категориям и по месяцам. Используй для вопросов про статистику, траты, сколько потратил/получил.",
      inputSchema: getTransactionStatsInputSchema,
      execute: async (input) => {
        if (input.categoryId) {
          const category = categoriesById.get(input.categoryId);
          if (!category) {
            return {
              success: false as const,
              error: "Категория не найдена",
            };
          }
          if (category.kind !== input.kind) {
            return {
              success: false as const,
              error: `Категория «${category.name}» относится к ${category.kind}, а запрошен ${input.kind}`,
            };
          }
        }

        if (input.walletId && !walletsById.has(input.walletId)) {
          return {
            success: false as const,
            error: "Кошелёк не найден",
          };
        }

        const filters: TransactionFilters = {
          ...(input.categoryId ? { categoryId: input.categoryId } : {}),
          ...(input.walletId ? { walletId: input.walletId } : {}),
          ...(input.moneyType ? { moneyType: input.moneyType } : {}),
          ...(input.from ? { from: input.from } : {}),
          ...(input.to ? { to: input.to } : {}),
        };

        const stats = await getTransactionStats(userId, input.kind, filters);
        const category = input.categoryId
          ? categoriesById.get(input.categoryId)
          : undefined;

        return {
          success: true as const,
          kind: stats.kind,
          filters: {
            categoryId: input.categoryId ?? null,
            categoryName: category?.name ?? null,
            walletId: input.walletId ?? null,
            moneyType: input.moneyType ?? null,
            from: input.from ?? null,
            to: input.to ?? null,
          },
          byCurrency: stats.byCurrency.map((currencyStats) => ({
            currency: currencyStats.currency,
            total: currencyStats.total,
            count: currencyStats.count,
            average: currencyStats.average,
            byCategory: currencyStats.byCategory,
            byMonth: currencyStats.byMonth,
          })),
        };
      },
    }),
  } satisfies ToolSet;
}

export type AssistantTools = ReturnType<typeof createAssistantTools>;
