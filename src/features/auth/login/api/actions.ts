"use server";

import { prisma } from "@/src/lib/prisma";
import { hashPassword, verifyPassword } from "@/src/lib/auth/password";
import { getHomePathForRole } from "@/src/lib/auth/roles";
import { createSession, destroySession } from "@/src/lib/auth/session";
import { loginSchema, type LoginInput } from "../model/schema";
import { redirect } from "next/navigation";

type LoginResult = {
  error?: string;
};

function getSuperAdminCredentials() {
  return {
    email: (process.env.SUPER_ADMIN_EMAIL ?? "").trim().toLowerCase(),
    password: process.env.SUPER_ADMIN_PASSWORD ?? "",
  };
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const superAdmin = getSuperAdminCredentials();

  if (
    superAdmin.email &&
    superAdmin.password &&
    normalizedEmail === superAdmin.email &&
    password === superAdmin.password
  ) {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: { role: "SUPER_ADMIN" },
      create: {
        email: normalizedEmail,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    await createSession({
      userId: user.id,
      email: normalizedEmail,
      role: "SUPER_ADMIN",
    });
    redirect(getHomePathForRole("SUPER_ADMIN"));
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Неверный логин или пароль" };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect(getHomePathForRole(user.role));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
