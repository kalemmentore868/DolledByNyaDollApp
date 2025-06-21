import ScreenLayout from "@/components/ScreenLayout";
import { ProductService } from "@/services/ProductService";
import { Product } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await ProductService.list();
      setProducts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary-100">
        <ActivityIndicator size="large" color="#f6339a" />
      </SafeAreaView>
    );
  }

  return (
    <ScreenLayout title="Products & Services" scroll={true}>
      <View className="space-y-4 pb-2 pt-3">
        {products.map((product) => {
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
              key={product.wordpress_id}
              className="bg-white rounded-2xl shadow-md p-4 flex-row gap-4 mb-4"
              onPress={() => router.push(`/products/${product.wordpress_id}`)}
            >
              <Image
                source={{ uri: product.images[0] }}
                className="w-24 h-24 rounded-xl"
                resizeMode="cover"
              />
              <View className="flex-1 justify-between">
                <View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-JakartaBold text-gray-900">
                      {product.name}
                    </Text>
                    {isBooking && (
                      <Text className="text-xs bg-primary-300 text-black px-2 py-1 rounded-full">
                        Booking
                      </Text>
                    )}
                  </View>
                  <Text
                    className="text-sm text-gray-600 mt-1"
                    numberOfLines={2}
                  >
                    {product.description.replace(/<[^>]*>?/gm, "")}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-primary-600 font-JakartaSemiBold text-base">
                    {priceLabel}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenLayout>
  );
}
