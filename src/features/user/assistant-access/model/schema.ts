import { z } from "zod";

export const assistantAccessItemSchema = z.object({
  userId: z.string().min(1),
  assistantEnabled: z.boolean(),
});

export const updateUsersAssistantAccessSchema = z.object({
  users: z.array(assistantAccessItemSchema),
});

export type AssistantAccessItem = z.infer<typeof assistantAccessItemSchema>;
export type UpdateUsersAssistantAccessInput = z.infer<
  typeof updateUsersAssistantAccessSchema
>;
