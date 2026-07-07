"use client";

import { useId, type ReactNode } from "react";
import { TrashIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type DeleteButtonProps = {
  onDelete: () => void;
  isPending?: boolean;
  error?: string | null;
  blockedHint?: ReactNode;
  loadingText?: string;
};

export function DeleteButton({
  onDelete,
  isPending = false,
  error = null,
  blockedHint,
  loadingText = "Удаление...",
}: DeleteButtonProps) {
  const hintId = useId();
  const isBlocked = blockedHint != null;

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        className={cn("w-auto", isBlocked && "cursor-not-allowed")}
        loading={isPending}
        loadingText={loadingText}
        onClick={isBlocked ? undefined : onDelete}
        disabled={isPending}
        aria-disabled={isBlocked || isPending}
        popoverTarget={isBlocked ? hintId : undefined}
        popoverTargetAction={isBlocked ? "toggle" : undefined}
        variant="destructive"
      >
        <TrashIcon />
      </Button>
      {isBlocked ? (
        <span
          popover="auto"
          id={hintId}
          className="text-xs bg-accent text-accent-foreground rounded shadow p-2 m-0 mt-1 inset-auto [position-area:bottom]"
        >
          {blockedHint}
        </span>
      ) : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
