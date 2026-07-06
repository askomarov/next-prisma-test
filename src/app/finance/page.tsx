import { TransactionForm } from "@/features/transaction";
import { Panel } from "@/shared/ui/panel";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { TransactionsTable } from "@/widgets/transactions-table";

export const dynamic = "force-dynamic";

type FinancePageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function FinancePage({ searchParams }: FinancePageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <PageShell>
      <PageHero
        eyebrow="Финансы"
        title="Учёт расходов и приходов"
        lede="Записывайте операции с реальными и виртуальными деньгами."
      />

      <div className="mb-4">
        <Panel title="Новая запись">
          <TransactionForm />
        </Panel>
      </div>

      <TransactionsTable page={page} />
    </PageShell>
  );
}
