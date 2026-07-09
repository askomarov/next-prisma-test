"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FormError, FormField, Input } from "@/shared/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group/input-group";
import { login } from "../api/actions";
import { loginSchema, type LoginInput } from "../model/schema";
import { loginFormVariants } from "./login-form.variants";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

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
    <form onSubmit={handleSubmit(onSubmit)} className={loginFormVariants()}>
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
        <InputGroup>
          <InputGroupInput
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password", {
              onChange: () => clearErrors("password"),
            })}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
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
