"use client";

import { MenuIcon } from "lucide-react";
import type { CategoryOption } from "@/entities/category";
import type { WalletOption } from "@/entities/wallet";
import { logout } from "@/features/auth/login";
import { CreateTransactionDialog } from "@/features/transaction";
import { CreateWalletDialog } from "@/features/wallet";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import type { AuthBarNavItem } from "../lib/auth-bar-nav";
import { AuthBarNavLinks } from "./auth-bar-nav-links";
import { ThemeToggle } from "@/src/shared/ui/theme-toggle";

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
      <div className="grid gap-4">
        <AuthBarNavLinks
          items={navItems}
          variant="mobile"
          className="grid gap-1"
          closeOnNavigate
        />

        <ThemeToggle variant="expanded" />

        <div className="grid gap-2 border-t border-border pt-4">
          <CreateWalletDialog />
          <CreateTransactionDialog
            wallets={wallets}
            categories={categories}
            label="Добавить транзакцию"
          />
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              Выйти
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
