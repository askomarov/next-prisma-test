import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@/entities/wallet";

export const walletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Название обязательно")
    .max(50, "Название не длиннее 50 символов"),
  currency: z.enum(SUPPORTED_CURRENCIES, {
    message: "Выберите валюту",
  }),
  description: z
    .string()
    .trim()
    .max(500, "Описание не длиннее 500 символов")
    .optional()
    .or(z.literal("")),
});

export const walletUpdateSchema = walletSchema.omit({ currency: true });

export type WalletInput = z.infer<typeof walletSchema>;
export type WalletUpdateInput = z.infer<typeof walletUpdateSchema>;
export type WalletField = keyof WalletInput;
export type WalletUpdateField = keyof WalletUpdateInput;
