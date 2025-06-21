import ScreenLayout from "@/components/ScreenLayout";
import { ProductService } from "@/services/ProductService";
import { Product } from "@/types/Product";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    null
  );
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const found = await ProductService.getById(Number(id));
      setProduct(found);
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <ScreenLayout title="Loading..." scroll={false}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f6339a" />
        </View>
      </ScreenLayout>
    );
  }

  const renderPrice = () => {
    if (product.type === "variable") {
      if (selectedVariation == null) return null;
      const variation = product.variations[selectedVariation];
      return (
        <Text className="text-xl font-JakartaSemiBold text-primary-600">
          ${variation.price}
        </Text>
      );
    }
    return (
      <Text className="text-xl font-JakartaSemiBold text-primary-600">
        ${product.price}
      </Text>
    );
  };

  return (
    <ScreenLayout title={product.name}>
      {/* Image Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        className="mb-4 rounded-xl overflow-hidden"
      >
        {product.images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            className="w-[100%] h-64"
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Description */}
      <Text className="text-sm text-gray-700 mb-4">
        {product.description.replace(/<[^>]*>?/gm, "")}
      </Text>

      {/* Variation Selector */}
      {product.type === "variable" && (
        <View className="mb-4 space-y-2">
          <Text className="font-JakartaSemiBold text-gray-900">
            Choose an Option
          </Text>
          {product.variations.map((variation, index) => (
            <TouchableOpacity
              key={variation.variation_id}
              onPress={() => setSelectedVariation(index)}
              className={`p-3 rounded-xl border ${
                selectedVariation === index
                  ? "border-primary-600 bg-primary-100"
                  : "border-gray-300"
              }`}
            >
              <Text>
                {Object.entries(variation.attributes)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Booking Date Picker */}
      {product.type === "booking" && (
        <View className="mb-4">
          <Text className="font-JakartaSemiBold text-gray-900 mb-2">
            Select Date & Time
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="p-3 border border-gray-300 rounded-xl"
          >
            <Text>{date.toLocaleString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={(event, selected) => {
                setShowPicker(false);
                if (selected) setDate(selected);
              }}
            />
          )}
        </View>
      )}

      {/* Price */}
      <View className="my-4">{renderPrice()}</View>

      {/* Action Button */}
      <TouchableOpacity className="bg-primary-600 p-4 rounded-full items-center">
        <Text className="text-white text-base font-JakartaSemiBold">
          {product.type === "booking" ? "Book Now" : "Add to Cart"}
        </Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}
