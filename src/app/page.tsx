import { CreateUserDialog } from "@/features/user/create";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { UsersTable } from "@/widgets/users-table";
import { canCreateUsers } from "@/src/lib/auth/guards";
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
  const showCreateForms = session ? canCreateUsers(session.role) : false;

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
