import { z } from "zod";

export const userPreferencesSchema = z.object({
  defaultWalletId: z.string().optional().or(z.literal("")),
  defaultMoneyType: z
    .enum(["REAL", "VIRTUAL"])
    .optional()
    .or(z.literal("")),
  defaultKind: z.enum(["INCOME", "EXPENSE"]).optional().or(z.literal("")),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type UserPreferencesField = keyof UserPreferencesInput;
