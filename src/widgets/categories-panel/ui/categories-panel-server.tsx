import type { CategoryListItem } from "@/entities/category";
import { getUserCategoryList } from "@/entities/category/server";
import { EmptyState, Panel } from "@/shared/ui/panel";
import { requireAuthUserId } from "@/src/lib/auth/guards";
import { CategoriesDataTable } from "./categories-data-table";

type CategoriesPanelProps = {
  categories?: CategoryListItem[];
};

export async function CategoriesPanel({
  categories: initialCategories,
}: CategoriesPanelProps) {
  const { userId } = await requireAuthUserId();
  const categories = initialCategories ?? (await getUserCategoryList(userId));

  return (
    <Panel title="Категории" meta={<>{categories.length} шт.</>}>
      {categories.length === 0 ? (
        <EmptyState className="text-center">
          Категорий пока нет. Создайте первую или обновите страницу для
          дефолтного набора.
        </EmptyState>
      ) : (
        <CategoriesDataTable data={categories} />
      )}
    </Panel>
  );
}
