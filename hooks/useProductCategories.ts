// src/hooks/useProductCategories.ts
import { customAuthFetch } from "@/services/utils";
import { Product } from "@/types/Product";
import { useQuery } from "@tanstack/react-query";

type CategoriesResponse = { message: string; data: string[] };
type ProductsListResponse = {
  message: string;
  data: { items: Product[]; page: number; totalPages: number; total: number };
};

export function useProductCategories() {
  return useQuery<string[], Error>({
    queryKey: ["product-categories"],
    queryFn: async () => {
      // Try backend endpoint first
      try {
        const res = await customAuthFetch<CategoriesResponse>(
          "products/categories",
          "GET"
        );
        if (Array.isArray(res.data)) return res.data;
      } catch (_) {
        // Ignore and fall back
      }

      // Fallback: derive from first page of products
      const res = await customAuthFetch<ProductsListResponse>(
        "products?page=1&pageSize=100",
        "GET"
      );
      const items = res.data.items ?? [];
      const set = new Set<string>();
      items.forEach((p) => p.categories?.forEach((c) => set.add(c)));
      return [...set].sort((a, b) => a.localeCompare(b));
    },
    staleTime: 10 * 60_000,
  });
}
