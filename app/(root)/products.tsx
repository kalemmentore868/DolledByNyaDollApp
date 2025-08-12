// src/app/(tabs)/products/ProductsPage.tsx
import ScreenLayout from "@/components/ScreenLayout";
import { useProductCategories } from "@/hooks/useProductCategories";
import { Filters, useProductsInfinite } from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// tiny debounce
function useDebounced<T>(value: T, ms = 350) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function cleanText(s: string) {
  return (s ?? "")
    .replace(/\\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProductsPage() {
  // filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);

  const qDebounced = useDebounced(q, 350);
  const filters = useMemo<Filters>(
    () => ({ q: qDebounced || undefined, category }),
    [qDebounced, category]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useProductsInfinite(filters);

  const { data: categories = [], isLoading: loadingCats } =
    useProductCategories();

  // flatten pages
  const products = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-100">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-100 px-4">
        <Text className="text-red-500 font-JakartaBold">
          Failed to load products
        </Text>
        <Text className="text-gray-500 mt-2 text-center">{String(error)}</Text>
      </SafeAreaView>
    );
  }

  return (
    // IMPORTANT: ensure ScreenLayout does NOT wrap children in a ScrollView here.
    // If your ScreenLayout has a `scroll` prop, pass `scroll={false}`.
    <ScreenLayout title="Products & Services" scroll={false}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        // Header = filters (so there’s only one scroll container)
        ListHeaderComponent={
          <View className="gap-3 mb-2">
            {/* Search */}
            <View className="flex-row items-center bg-white rounded-2xl px-1 py-2 border border-gray-200">
              <Ionicons name="search" size={18} color="#888" />
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search products…"
                className="flex-1 ml-2 text-[16px]"
                returnKeyType="search"
                autoCorrect={false}
              />
              {q.length > 0 && (
                <TouchableOpacity onPress={() => setQ("")}>
                  <Ionicons name="close-circle" size={18} color="#bbb" />
                </TouchableOpacity>
              )}
            </View>

            {/* Category chips */}
            <FlatList
              horizontal
              data={["All", ...categories]}
              keyExtractor={(c) => c}
              contentContainerStyle={{ gap: 8 }}
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={loadingCats ? <ActivityIndicator /> : null}
              renderItem={({ item: c }) => {
                const value = c === "All" ? undefined : c;
                const active = category === value || (!category && c === "All");
                return (
                  <TouchableOpacity
                    onPress={() => setCategory(value)}
                    className={`px-3 py-2 rounded-full border mb-3 ${
                      active
                        ? "bg-black border-black"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        active ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        }
        renderItem={({ item: product }) => {
          const isBooking = product.type === "booking";
          const isVariable = product.type === "variable";

          const priceLabel = isVariable
            ? (() => {
                const prices = product.variations.map((v) => v.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                return `$${min} - $${max}`;
              })()
            : `$${product.price}`;

          return (
            <TouchableOpacity
              className="bg-white rounded-2xl shadow-md p-4 flex-row gap-4 mb-4"
              onPress={() => router.push(`/products/${product.wordpress_id}`)}
            >
              <Image
                source={{ uri: product.images?.[0] }}
                className="w-24 h-24 rounded-xl"
                resizeMode="cover"
              />

              <View className="flex-1 justify-between">
                <View>
                  <Text className="text-lg font-JakartaBold text-gray-900">
                    {product.name}
                  </Text>
                  {isBooking && (
                    <Text className="self-start mt-1 text-[11px] px-2 py-1 rounded-full bg-primary-300 text-black">
                      Booking
                    </Text>
                  )}
                </View>

                <Text className="text-sm text-gray-600 mt-2" numberOfLines={2}>
                  {cleanText(product.description)}
                </Text>

                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-primary-600 font-JakartaSemiBold text-base">
                    {priceLabel}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        // infinite scroll
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        // pull to refresh
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        // Mild perf tweaks (see RN docs)
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={7}
      />
    </ScreenLayout>
  );
}
