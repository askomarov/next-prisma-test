import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { FormError } from "../form-error/form-error";
import { formFieldVariants } from "./form-field.variants";

type FormFieldProps = {
  error?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ error, children, className }: FormFieldProps) {
  return (
    <div className={cn(formFieldVariants(), className)}>
      {children}
      <FormError message={error} />
    </div>
  );
}
