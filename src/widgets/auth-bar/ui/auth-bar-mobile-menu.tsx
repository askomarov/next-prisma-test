"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { logout } from "@/features/auth/login";
import { CreateTransactionDialog } from "@/features/transaction";
import { CreateWalletDialog } from "@/features/wallet";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";
import type { AuthBarNavItem } from "../lib/auth-bar-nav";
import {
  authBarLinkVariants,
  authBarMobileMenuActionsVariants,
  authBarMobileMenuLinksVariants,
  authBarMobileMenuNavVariants,
} from "./auth-bar.variants";

type AuthBarMobileMenuProps = {
  navItems: AuthBarNavItem[];
  wallets: WalletOption[];
  categories: CategoryOption[];
};

export function AuthBarMobileMenu({
  navItems,
  wallets,
  categories,
}: AuthBarMobileMenuProps) {
  return (
    <Dialog
      className="w-[calc(100%-2rem)] max-w-sm"
      trigger={
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Открыть меню"
        >
          <MenuIcon />
        </Button>
      }
      title="Меню"
    >
      {({ close }) => (
        <div className={authBarMobileMenuNavVariants()}>
          <nav className={authBarMobileMenuLinksVariants()}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(authBarLinkVariants(), "block py-1")}
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={authBarMobileMenuActionsVariants()}>
            <CreateWalletDialog />
            <CreateTransactionDialog wallets={wallets} categories={categories} />
            <form action={logout}>
              <Button type="submit" variant="outline" className="w-full">
                Выйти
              </Button>
            </form>
          </div>
        </div>
      )}
    </Dialog>
  );
}
