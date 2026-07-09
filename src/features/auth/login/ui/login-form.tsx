"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, FormError, FormField, Input } from "@/shared/ui/button";
import { login } from "../api/actions";
import { loginSchema, type LoginInput } from "../model/schema";
import { loginFormVariants } from "./login-form.variants";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [email, password] = watch(["email", "password"]);
  const canSubmit = Boolean(email.trim() && password.trim());

  const onSubmit = async (data: LoginInput) => {
    const result = await login(data);

    if (result.error) {
      setError("root", { message: result.error });
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={loginFormVariants()}
    >
      <FormField error={errors.email?.message}>
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          error={Boolean(errors.email)}
          {...register("email", {
            onChange: () => clearErrors("email"),
          })}
        />
      </FormField>

      <FormField error={errors.password?.message}>
        <Input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          error={Boolean(errors.password)}
          {...register("password", {
            onChange: () => clearErrors("password"),
          })}
        />
      </FormField>

      <Button
        type="submit"
        loading={isSubmitting}
        loadingText="Вход..."
        disabled={!canSubmit}
      >
        Войти
      </Button>

      <FormError message={errors.root?.message} />
    </form>
  );
}
