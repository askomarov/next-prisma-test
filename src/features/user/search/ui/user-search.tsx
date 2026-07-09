"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { buildUsersUrl } from "@/entities/user";

type UserSearchProps = {
  defaultValue: string;
};

export function UserSearch({ defaultValue }: UserSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = value.trim();
      const current = defaultValue.trim();

      if (next === current) {
        return;
      }

      router.replace(
        buildUsersUrl({
          page: 1,
          search: next || undefined,
        }),
      );
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [value, defaultValue, router]);

  return (
    <Input
      type="search"
      placeholder="Поиск по имени или email"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      aria-label="Поиск пользователей по имени или email"
    />
  );
}
