"use client";

import { useState, useTransition } from "react";
import type { CategoryListItem } from "@/entities/category";
import { Button } from "@/shared/ui";
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
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        className="w-auto"
        loading={isPending}
        loadingText="Удаление..."
        onClick={handleDelete}
        disabled={category.transactionCount > 0}
      >
        Удалить
      </Button>
      {category.transactionCount > 0 ? (
        <span className="text-xs text-neutral-400">
          Есть операции ({category.transactionCount})
        </span>
      ) : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
