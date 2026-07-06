import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Название обязательно")
    .max(50, "Название не длиннее 50 символов"),
  kind: z.enum(["INCOME", "EXPENSE"], {
    message: "Выберите тип",
  }),
});

export const categoryUpdateSchema = categorySchema.pick({ name: true });

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CategoryField = keyof CategoryInput;
export type CategoryUpdateField = keyof CategoryUpdateInput;
