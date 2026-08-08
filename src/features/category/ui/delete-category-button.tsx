"use client";

import { useId, useState, useTransition } from "react";
import { TrashIcon } from "lucide-react";
import type { CategoryListItem } from "@/entities/category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { deleteCategory } from "../api/actions";

type DeleteCategoryButtonProps = {
  category: CategoryListItem;
};

export function DeleteCategoryButton({ category }: DeleteCategoryButtonProps) {
  const hintId = useId();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isBlocked = category.transactionCount > 0;
  const blockedHint = isBlocked
    ? `Есть транзакции (${category.transactionCount})`
    : undefined;

  const handleConfirm = () => {
    startTransition(async () => {
      setError(null);
      const result = await deleteCategory(category.id);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setOpen(false);
    });
  };

  if (isBlocked) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          type="button"
          variant="destructive"
          className={cn("w-auto", "cursor-not-allowed")}
          aria-disabled
          popoverTarget={hintId}
          popoverTargetAction="toggle"
        >
          <TrashIcon />
        </Button>
        <span
          popover="auto"
          id={hintId}
          className="text-xs bg-accent text-accent-foreground rounded shadow p-2 m-0 mt-1 inset-auto [position-area:bottom]"
        >
          {blockedHint}
        </span>
      </div>
    );
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return;
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
      }}
    >
      <AlertDialogTrigger
        render={<Button variant="destructive" className="w-auto" />}
      >
        <TrashIcon />
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
          <AlertDialogDescription>
            Категория «{category.name}» будет удалена безвозвратно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            loading={isPending}
            loadingText="Удаление..."
            onClick={handleConfirm}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
