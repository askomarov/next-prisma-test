"use client";

import { createContext, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, FormError, FormField, Input } from "@/shared/ui/button";
import { createUser } from "../api/actions";
import { createUserSchema, type CreateUserInput } from "../model/schema";
import { createUserFormVariants } from "./create-user-form.variants";

export const CreateUserSuccessContext = createContext<(() => void) | null>(
  null,
);

export function CreateUserForm() {
  const onSuccess = useContext(CreateUserSuccessContext);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: CreateUserInput) => {
    const result = await createUser(data);

    if ("error" in result) {
      if (result.field) {
        setError(result.field, { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }

    reset();
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={createUserFormVariants()}
    >
      <FormField error={errors.name?.message}>
        <Input
          type="text"
          placeholder="Name"
          error={Boolean(errors.name)}
          {...register("name", {
            onChange: () => clearErrors("name"),
          })}
        />
      </FormField>

      <FormField error={errors.email?.message}>
        <Input
          type="email"
          placeholder="Email"
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
          error={Boolean(errors.password)}
          {...register("password", {
            onChange: () => clearErrors("password"),
          })}
        />
      </FormField>

      <Button type="submit" loading={isSubmitting} loadingText="Creating...">
        Create User
      </Button>

      <FormError message={errors.root?.message} />
    </form>
  );
}
