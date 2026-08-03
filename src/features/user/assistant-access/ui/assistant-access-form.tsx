"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, FormError } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { updateUsersAssistantAccess } from "../api/actions";
import type { UserAssistantAccess } from "../model/types";
import {
  updateUsersAssistantAccessSchema,
  type UpdateUsersAssistantAccessInput,
} from "../model/schema";
type AssistantAccessFormProps = {
  users: UserAssistantAccess[];
};

export function AssistantAccessForm({ users }: AssistantAccessFormProps) {
  const [saved, setSaved] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUsersAssistantAccessInput>({
    resolver: zodResolver(updateUsersAssistantAccessSchema),
    defaultValues: {
      users: users.map((user) => ({
        userId: user.id,
        assistantEnabled: user.assistantEnabled,
      })),
    },
  });

  const onSubmit = async (data: UpdateUsersAssistantAccessInput) => {
    setSaved(false);
    const result = await updateUsersAssistantAccess(data);

    if ("error" in result) {
      setError("root", { message: result.error });
      return;
    }

    setSaved(true);
  };

  if (users.length === 0) {
    return <p className="text-sm text-neutral-500">Пользователей пока нет.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <ul className="m-0 grid list-none gap-2 p-0">
        {users.map((user, index) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
          >
            <input type="hidden" {...register(`users.${index}.userId`)} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user.name || "Без имени"}
              </p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            </div>
            <Controller
              name={`users.${index}.assistantEnabled`}
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setSaved(false);
                  }}
                  aria-label={`Доступ к ассистенту для ${user.email}`}
                />
              )}
            />
          </li>
        ))}
      </ul>

      <Button type="submit" loading={isSubmitting} loadingText="Сохранение...">
        Сохранить
      </Button>

      {saved ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Доступ сохранён
        </p>
      ) : null}

      <FormError message={errors.root?.message} />
    </form>
  );
}
