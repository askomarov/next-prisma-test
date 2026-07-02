"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buildUsersUrl } from "./users-query";

type UserSearchProps = {
  defaultValue: string;
};

export default function UserSearch({ defaultValue }: UserSearchProps) {
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
    <input
      type="search"
      placeholder="Search by name or email"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="userSearch"
      aria-label="Search users by name or email"
    />
  );
}
