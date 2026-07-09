"use client";

import { useState, useTransition } from "react";
import type { CategoryListItem } from "@/entities/category";
import { DeleteButton } from "@/shared/ui/delete-button";
import { deleteCategory } from "../api/actions";

type DeleteCategoryButtonProps = {
  category: CategoryListItem;
};

export function DeleteCategoryButton({ category }: DeleteCategoryButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !window.confirm(
        `Удалить категорию «${category.name}»? Это действие нельзя отменить.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await deleteCategory(category.id);

      if ("error" in result) {
        setError(result.error);
      }
    });
  };

  return (
    <DeleteButton
      onDelete={handleDelete}
      isPending={isPending}
      error={error}
      blockedHint={
        category.transactionCount > 0
          ? `Есть транзакции (${category.transactionCount})`
          : undefined
      }
    />
  );
}
