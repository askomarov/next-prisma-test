import { redirect } from "next/navigation";
import { CreateUserDialog } from "@/features/user/create";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { UsersTable } from "@/widgets/users-table";
import { canCreateUsers, canViewUsers } from "@/src/lib/auth/guards";
import { getSession } from "@/src/lib/auth/session";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = searchParam ?? "";
  const session = await getSession();

  if (!session || !canViewUsers(session.role)) {
    redirect("/finance");
  }

  const showCreateForms = canCreateUsers(session.role);

  return (
    <PageShell>
      <PageHero
        eyebrow="Next.js + Prisma 7"
        title="Users from your database, loaded on the server."
        lede={
          <>
            This page reads from <code>src/app/page.tsx</code> using the Prisma
            instance in <code>src/lib/prisma.ts</code>.
          </>
        }
      />

      {showCreateForms ? (
        <div className="mb-4">
          <CreateUserDialog />
        </div>
      ) : null}

      <UsersTable page={page} search={search} />
    </PageShell>
  );
}
