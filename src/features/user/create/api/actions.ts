"use server";

import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/auth/password";
import { requireRole } from "@/src/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { createUserSchema, type CreateUserInput } from "../model/schema";

type CreateUserResult =
  | { success: true }
  | { error: string; field?: "name" | "email" | "password" };

export async function createUser(
  input: CreateUserInput,
): Promise<CreateUserResult> {
  try {
    await requireRole("ADMIN", "SUPER_ADMIN");
  } catch {
    return { error: "Forbidden" };
  }

  const parsed = createUserSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: issue.message,
      field: issue.path[0] as "name" | "email" | "password" | undefined,
    };
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        passwordHash,
      },
    });
  } catch {
    return { error: "Email already exists", field: "email" };
  }

  revalidatePath("/");
  return { success: true };
}
