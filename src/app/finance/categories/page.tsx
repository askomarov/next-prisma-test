import { getUserCategoryList } from "@/entities/category/server";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { CategoriesPanel } from "@/widgets/categories-panel";
import { CreateCategoryDialog } from "@/features/category";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { userId } = await requireAuthUserId();
  const categories = await getUserCategoryList(userId);

  return (
    <PageShell>
      <PageHero
        eyebrow="Финансы"
        title="Категории"
        lede="Группируйте транзакции: продукты, транспорт, зарплата и свои категории."
        className="sm:grid sm:gap-x-10"
      >
        <CreateCategoryDialog className="sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:self-start" />
      </PageHero>

      <CategoriesPanel categories={categories} />
    </PageShell>
  );
}
