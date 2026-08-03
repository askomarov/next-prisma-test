"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/src/lib/auth/guards";
import { prisma } from "@/src/lib/prisma";
import {
  updateUsersAssistantAccessSchema,
  type UpdateUsersAssistantAccessInput,
} from "../model/schema";

type UpdateUsersAssistantAccessResult =
  | { success: true }
  | { error: string };

export async function updateUsersAssistantAccess(
  input: UpdateUsersAssistantAccessInput,
): Promise<UpdateUsersAssistantAccessResult> {
  try {
    await requireRole("SUPER_ADMIN");
  } catch {
    return { error: "Forbidden" };
  }

  const parsed = updateUsersAssistantAccessSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.$transaction(
      parsed.data.users.map((user) =>
        prisma.user.update({
          where: { id: user.userId },
          data: { assistantEnabled: user.assistantEnabled },
        }),
      ),
    );
  } catch {
    return { error: "Не удалось сохранить доступ" };
  }

  revalidatePath("/account");
  return { success: true };
}
