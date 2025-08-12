// src/hooks/useProducts.ts
import { customAuthFetch } from "@/services/utils";
import { Product } from "@/types/Product";
import { useInfiniteQuery } from "@tanstack/react-query";

export type Filters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  pageSize?: number;
};

type Page = {
  items: Product[];
  page: number;
  totalPages: number;
  total: number;
};

type ListResponse = {
  message: string;
  data: Page;
};

function toQS(params: Record<string, any>) {
  const pairs = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return new URLSearchParams(pairs as [string, string][]).toString();
}

export function useProductsInfinite(rawFilters: Filters = {}) {
  const pageSize = rawFilters.pageSize ?? 12;
  const filters = { ...rawFilters, pageSize };

  return useInfiniteQuery<Page, Error>({
    queryKey: ["products", filters],
    initialPageParam: 1, // <-- v5 requires this
    queryFn: async ({ pageParam }) => {
      const qs = toQS({ ...filters, page: pageParam });
      const res = await customAuthFetch<ListResponse>(`products?${qs}`, "GET");
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 60_000,
  });
}
