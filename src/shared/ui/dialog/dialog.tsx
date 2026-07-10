"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { XIcon } from "lucide-react";

export const DialogOnCloseContext = createContext<(() => void) | null>(null);
export const DialogCloseContext = createContext<(() => void) | null>(null);

export type DialogOpenContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const DialogOpenContext = createContext<DialogOpenContextValue | null>(
  null,
);

type DialogProps = {
  trigger?: ReactElement<{ onClick?: (event: React.MouseEvent) => void }>;
  title: string;
  children: ReactNode | ((actions: { close: () => void }) => ReactNode);
  className?: string;
};

export function Dialog({
  trigger,
  title,
  children,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onClose = useContext(DialogOnCloseContext);
  const openContext = useContext(DialogOpenContext);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = openContext !== null;
  const open = isControlled ? openContext.open : internalOpen;
  const setOpen = isControlled ? openContext.setOpen : setInternalOpen;

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  const openDialog = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  useEffect(() => {
    if (!isControlled) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [isControlled, open]);

  const handleDialogClose = () => {
    onClose?.();
    setOpen(false);
  };

  const triggerElement =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger, {
          onClick: (event: React.MouseEvent) => {
            trigger.props.onClick?.(event);
            openDialog();
          },
        })
      : trigger;

  const content =
    typeof children === "function" ? children({ close }) : children;

  return (
    <>
      {triggerElement}
      <dialog
        ref={dialogRef}
        className={cn(
          "w-full max-w-md m-auto rounded-lg border border-border bg-background p-4 shadow-lg backdrop:bg-black/70",
          className,
        )}
        onClose={handleDialogClose}
        closedby="any"
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <h2 className="m-0 text-sm font-semibold">{title}</h2>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Close"
            onClick={close}
          >
            <XIcon />
          </Button>
        </header>
        <DialogCloseContext.Provider value={close}>
          {content}
        </DialogCloseContext.Provider>
      </dialog>
    </>
  );
}
