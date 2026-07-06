"use client";

import type { CategoryListItem } from "@/entities/category";
import { TRANSACTION_KIND_LABELS } from "@/entities/transaction";
import {
  CreateCategoryDialog,
  DeleteCategoryButton,
  EditCategoryDialog,
} from "@/features/category";
import {
  categoriesListVariants,
  categoryActionsVariants,
  categoryItemVariants,
  categoryKindVariants,
} from "./categories-panel.variants";

type CategoryListItemRowProps = {
  category: CategoryListItem;
};

export function CategoryListItemRow({ category }: CategoryListItemRowProps) {
  return (
    <li className={categoryItemVariants()}>
      <div className="flex flex-wrap items-center gap-2">
        <strong>{category.name}</strong>
        <span className={categoryKindVariants()}>
          {TRANSACTION_KIND_LABELS[category.kind]}
        </span>
      </div>
      <div className={categoryActionsVariants()}>
        <EditCategoryDialog category={category} />
        <DeleteCategoryButton category={category} />
      </div>
    </li>
  );
}

type CategoriesListProps = {
  categories: CategoryListItem[];
};

export function CategoriesList({ categories }: CategoriesListProps) {
  return (
    <ul className={categoriesListVariants()}>
      {categories.map((category) => (
        <CategoryListItemRow key={category.id} category={category} />
      ))}
    </ul>
  );
}

export function CategoriesPanelActions() {
  return <CreateCategoryDialog />;
}
