import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "./button.variants";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export function Button({
  loading = false,
  loadingText,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants(), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
