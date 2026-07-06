import { z } from "zod";

export const transactionSchema = z.object({
  walletId: z.string().min(1, "Выберите кошелёк"),
  kind: z.enum(["INCOME", "EXPENSE"]),
  moneyType: z.enum(["REAL", "VIRTUAL"]),
  amount: z
    .number({ message: "Сумма обязательна" })
    .refine((value) => !Number.isNaN(value), "Сумма обязательна")
    .positive("Сумма должна быть больше 0"),
  description: z
    .string()
    .trim()
    .max(500, "Описание не длиннее 500 символов")
    .optional()
    .or(z.literal("")),
  occurredAt: z.date({ message: "Укажите дату" }),
  categoryId: z
    .string()
    .optional()
    .or(z.literal("")),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export type TransactionField = keyof TransactionInput;
