import { cn } from "@/shared/lib/cn";
import { formErrorVariants } from "./form-error.variants";

type FormErrorProps = {
  message?: string;
  className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return <p className={cn(formErrorVariants(), className)}>{message}</p>;
}
