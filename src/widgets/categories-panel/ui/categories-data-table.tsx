"use client";

import { useState } from "react";
import {
  useTable,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { CategoryListItem } from "@/entities/category";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { columns } from "./categories-columns";
import { features } from "./categories-data-table-features";

type CategoriesDataTableProps = {
  data: CategoryListItem[];
};

export function CategoriesDataTable({ data }: CategoriesDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useTable({
    features,
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Поиск по названию..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={(table.getColumn("kind")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table
              .getColumn("kind")
              ?.setFilterValue(event.target.value || undefined)
          }
          className="w-auto min-w-40"
          aria-label="Фильтр по типу"
        >
          <option value="">Все типы</option>
          <option value="INCOME">Приход</option>
          <option value="EXPENSE">Расход</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
