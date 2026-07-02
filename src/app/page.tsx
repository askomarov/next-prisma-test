import CreateUserForm from "./create-user-form";
import CreateUserRhfForm from "./create-user-rhf-form";
import UsersTable from "./users-table";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const search = searchParam ?? "";

  return (
    <main className="shell">
      <div className="hero">
        <p className="eyebrow">Next.js + Prisma 7</p>
        <h1>Users from your database, loaded on the server.</h1>
        <p className="lede">
          This page reads from <code>src/app/page.tsx</code> using the Prisma
          instance in <code>src/lib/prisma.ts</code>.
        </p>
      </div>

      <section className="panel mb-4">
        <div className="panelHeader">
          <h2>Server Action form</h2>
        </div>
        <CreateUserForm />
      </section>

      <section className="panel mb-4">
        <div className="panelHeader">
          <h2>react-hook-form + zod</h2>
        </div>
        <CreateUserRhfForm />
      </section>

      <UsersTable page={page} search={search} />
    </main>
  );
}
