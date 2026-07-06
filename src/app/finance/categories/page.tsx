import { getUserCategoryList } from "@/entities/category/server";
import { PageHero, PageShell } from "@/shared/ui/page-shell";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { CategoriesPanel } from "@/widgets/categories-panel";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { userId } = await requireAuthUserId();
  const categories = await getUserCategoryList(userId);

  return (
    <PageShell>
      <PageHero
        eyebrow="Финансы"
        title="Категории"
        lede="Группируйте операции: продукты, транспорт, зарплата и свои категории."
      />

      <CategoriesPanel categories={categories} />
    </PageShell>
  );
}
