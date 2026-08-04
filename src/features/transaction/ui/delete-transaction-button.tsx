"use client";

import { useState, useTransition } from "react";
import { TrashIcon } from "lucide-react";
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
import { deleteTransaction } from "../api/actions";

type DeleteTransactionButtonProps = {
  transactionId: string;
  label?: string;
};

export function DeleteTransactionButton({
  transactionId,
  label,
}: DeleteTransactionButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const description = label
    ? `Транзакция «${label}» будет удалена безвозвратно.`
    : "Это действие нельзя отменить.";

  const handleConfirm = () => {
    startTransition(async () => {
      setError(null);
      const result = await deleteTransaction(transactionId);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setOpen(false);
    });
  };

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
          <AlertDialogTitle>Удалить транзакцию?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
