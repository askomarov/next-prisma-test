import {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  tableFeatures,
} from "@tanstack/react-table";

export const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
});

export type CategoriesTableFeatures = typeof features;
