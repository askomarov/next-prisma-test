'use server'

import { prisma } from '@/src/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createUserSchema, type CreateUserInput } from './schema'

type CreateUserState = {
  error?: string
  input?: string
  resetKey?: number
}

type CreateUserRhfResult =
  | { success: true }
  | { error: string; field?: 'name' | 'email' }

export async function createUserRhf(
  input: CreateUserInput,
): Promise<CreateUserRhfResult> {
  const parsed = createUserSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      error: issue.message,
      field: issue.path[0] as 'name' | 'email' | undefined,
    }
  }

  try {
    await prisma.user.create({
      data: parsed.data,
    })
  } catch {
    return { error: 'Email already exists', field: 'email' }
  }

  revalidatePath('/')
  return { success: true }
}

export async function createUser(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  // ① Достаём и нормализуем
  const email = String(formData.get('email') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()

  if (!name) {
    return { error: 'Name is required', input: 'name' }
  }

  if (!email) {
    return { error: 'Email is required', input: 'email' }
  }

  if (!email.includes('@')) {
    return { error: 'Invalid email', input: 'email' }
  }

  // ③ Только после валидации — запись в БД
  try {
    await prisma.user.create({
      data: { email, name },
    })
  } catch (e) {
    // ④ Ошибки БД — тоже здесь
    return { error: 'Email already exists', input: 'email' }
  }

  revalidatePath('/')
  return { resetKey: (_prevState.resetKey ?? 0) + 1 }
}
