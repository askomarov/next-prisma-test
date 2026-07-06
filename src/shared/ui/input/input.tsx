import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
import { inputVariants } from "./input.variants";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ error: Boolean(error) }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
