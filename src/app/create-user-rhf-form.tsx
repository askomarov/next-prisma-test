"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserRhf } from "./users/actions";
import { createUserSchema, type CreateUserInput } from "./users/schema";

export default function CreateUserRhfForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (data: CreateUserInput) => {
    const result = await createUserRhf(data);

    if ("error" in result) {
      if (result.field) {
        setError(result.field, { message: result.error });
      } else {
        setError("root", { message: result.error });
      }
      return;
    }

    reset();
  };

  const inputClass = (field: keyof CreateUserInput) =>
    errors[field] ? "border border-red-500" : "border";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div className="grid gap-1">
        <input
          type="text"
          placeholder="Name"
          className={inputClass("name")}
          {...register("name", {
            onChange: () => clearErrors("name"),
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-1">
        <input
          type="email"
          placeholder="Email"
          className={inputClass("email")}
          {...register("email", {
            onChange: () => clearErrors("email"),
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create User"}
      </button>

      {errors.root && (
        <p className="text-red-500 text-sm">{errors.root.message}</p>
      )}
    </form>
  );
}
