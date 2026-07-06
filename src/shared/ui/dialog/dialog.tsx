"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { cn } from "@/shared/lib/cn";
import {
  dialogCloseVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogVariants,
} from "./dialog.variants";

export const DialogOnCloseContext = createContext<(() => void) | null>(null);

type DialogProps = {
  trigger: ReactElement<{ onClick?: (event: React.MouseEvent) => void }>;
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

  const close = () => dialogRef.current?.close();
  const open = () => dialogRef.current?.showModal();

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (event: React.MouseEvent) => {
          trigger.props.onClick?.(event);
          open();
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
        className={cn(dialogVariants(), className)}
        onClose={() => onClose?.()}
        closedby="any"
      >
        <header className={dialogHeaderVariants()}>
          <h2 className={dialogTitleVariants()}>{title}</h2>
          <button
            type="button"
            className={dialogCloseVariants()}
            aria-label="Close"
            onClick={close}
          >
            ×
          </button>
        </header>
        {content}
      </dialog>
    </>
  );
}
