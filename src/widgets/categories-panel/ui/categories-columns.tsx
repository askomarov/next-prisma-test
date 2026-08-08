"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { CategoryListItem } from "@/entities/category";
import {
  TRANSACTION_KIND_BADGE_VARIANTS,
  TRANSACTION_KIND_LABELS,
} from "@/entities/transaction";
import { DeleteCategoryButton, EditCategoryDialog } from "@/features/category";
import { Badge } from "@/shared/ui/badge/badge";
import type { CategoriesTableFeatures } from "./categories-data-table-features";

const columnHelper = createColumnHelper<
  CategoriesTableFeatures,
  CategoryListItem
>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Название",
    filterFn: "includesString",
  }),
  columnHelper.accessor("kind", {
    header: "Тип",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant={TRANSACTION_KIND_BADGE_VARIANTS[row.original.kind]}>
        {TRANSACTION_KIND_LABELS[row.original.kind]}
      </Badge>
    ),
  }),
  columnHelper.accessor("transactionCount", {
    header: "Транзакции",
    enableColumnFilter: false,
  }),
  columnHelper.display({
    id: "actions",
    header: "Действия",
    cell: ({ row }) => (
      <div className="flex flex-wrap items-center gap-2">
        <EditCategoryDialog category={row.original} />
        <DeleteCategoryButton category={row.original} />
      </div>
    ),
  }),
]);
