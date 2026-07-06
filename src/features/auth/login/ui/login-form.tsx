"use client";

import { useActionState } from "react";
import { Button, FormError, Input } from "@/shared/ui";
import { login } from "../api/actions";
import { loginFormVariants } from "./login-form.variants";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {});

  return (
    <form action={formAction} className={loginFormVariants()}>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        required
        autoComplete="email"
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        required
        autoComplete="current-password"
      />
      <Button type="submit" loading={isPending} loadingText="Signing in...">
        Sign in
      </Button>

      <FormError message={state.error} />
    </form>
  );
}
