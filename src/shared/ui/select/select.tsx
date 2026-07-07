import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import { selectVariants } from "./select.variants";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(selectVariants({ error: Boolean(error) }), className)}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
