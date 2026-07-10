"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { buttonVariants } from "@/shared/ui/button";
import { DialogCloseContext } from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";
import type { AuthBarNavItem } from "../lib/auth-bar-nav";
import { getActiveAuthBarNavItemHref } from "../lib/is-auth-bar-nav-item-active";

type AuthBarNavLinksProps = {
  items: AuthBarNavItem[];
  className?: string;
  variant?: "desktop" | "mobile";
  closeOnNavigate?: boolean;
};

export function AuthBarNavLinks({
  items,
  className,
  variant = "desktop",
  closeOnNavigate = false,
}: AuthBarNavLinksProps) {
  const closeDialog = useContext(DialogCloseContext);
  const pathname = usePathname();
  const activeHref = getActiveAuthBarNavItemHref(
    pathname,
    items.map((item) => item.href),
  );

  return (
    <nav
      className={className}
      aria-label={variant === "desktop" ? "Основная навигация" : undefined}
    >
      {items.map((item) => {
        const active = item.href === activeHref;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={
              closeOnNavigate && closeDialog
                ? () => {
                    closeDialog();
                  }
                : undefined
            }
            className={cn(
              variant === "desktop" &&
                buttonVariants({ variant: "link", size: "sm" }),
              variant === "desktop" && active && "underline",
              variant === "mobile" &&
                "block py-1 text-sm text-foreground no-underline hover:underline",
              variant === "mobile" && active && "underline",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
