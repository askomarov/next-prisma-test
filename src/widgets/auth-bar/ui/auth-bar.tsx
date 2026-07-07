import Link from "next/link";
import { logout } from "@/features/auth/login";
import { cn } from "@/shared/lib/utils";
import { canViewUsers } from "@/src/lib/auth/guards";
import type { SessionUser } from "@/src/lib/auth/types";
import {
  authBarEmailVariants,
  authBarInnerVariants,
  authBarLinkVariants,
  authBarVariants,
  logoutButtonVariants,
  roleBadgeVariants,
} from "./auth-bar.variants";

type AuthBarProps = {
  session: SessionUser;
};

export function AuthBar({ session }: AuthBarProps) {
  const showUsers = canViewUsers(session.role);

  return (
    <header className={authBarVariants()}>
      <div className={authBarInnerVariants()}>
        {showUsers ? (
          <Link href="/" className={authBarLinkVariants()}>
            Users
          </Link>
        ) : null}
        <Link href="/finance" className={authBarLinkVariants()}>
          Finance
        </Link>
        <Link href="/finance/transactions" className={authBarLinkVariants()}>
          Transactions
        </Link>
        <Link href="/finance/stats" className={authBarLinkVariants()}>
          Stats
        </Link>
        <Link href="/finance/categories" className={authBarLinkVariants()}>
          Categories
        </Link>
        <span className={authBarEmailVariants()}>{session.email}</span>
        <span className={roleBadgeVariants()}>{session.role}</span>
        <form action={logout}>
          <button type="submit" className={cn(logoutButtonVariants())}>
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
