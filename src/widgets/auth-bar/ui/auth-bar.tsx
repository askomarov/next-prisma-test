import Link from "next/link";
import { logout } from "@/features/auth/login";
import { cn } from "@/shared/lib/cn";
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
  return (
    <header className={authBarVariants()}>
      <div className={authBarInnerVariants()}>
        <Link href="/" className={authBarLinkVariants()}>
          Users
        </Link>
        <Link href="/finance" className={authBarLinkVariants()}>
          Finance
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
