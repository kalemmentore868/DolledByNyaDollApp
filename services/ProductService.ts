import { Product } from "@/types/Product";

const mockProducts: Product[] = [
  {
    wordpress_id: 1127,
    type: "simple",
    name: "Liquid Chlorophyll Drops",
    price: 100,
    description:
      "Liquid chlorophyll has become a popular product to add to water. It has been shown to improve skin, help weight loss, detox the body, and more.",
    categories: ["Supplements"],
    tags: ["detox", "Liquid chlorophyll", "skin care", "weight loss"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2025/05/IMG_9531-scaled.jpg",
    ],
    variations: [],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: Liquid Chlorophyll Drops | Categories: Supplements | Tags: detox, Liquid chlorophyll, skin care, weight loss | Price: 100.0",
  },
  {
    wordpress_id: 1129,
    type: "simple",
    name: "Raw Black African Soap",
    price: 60,
    description:
      "It’s antibacterial, safe for all skin types, moisturizing, anti-inflammatory, and helps fight acne and reduce dark spots.",
    categories: ["Skin Care", "Soaps"],
    tags: ["african black soap", "black soap", "lemon extract", "skin care"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2022/12/IMG_0756-scaled.jpg",
    ],
    variations: [],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: Raw Black African Soap | Categories: Skin Care, Soaps | Tags: african black soap, black soap, lemon extract, skin care | Price: 60.0",
  },
  {
    wordpress_id: 1131,
    type: "simple",
    name: "Clear Skin Combo",
    price: 200,
    description:
      "4oz Regular Strength Dark Mark Remover, Turmeric Soap and Acne Butter Combo to help clear blemishes.",
    categories: ["Skin Care"],
    tags: ["dark mark remover", "skin", "skin care", "turmeric"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2022/12/Clear-Skin-Combo.png",
    ],
    variations: [],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: Clear Skin Combo | Categories: Skin Care | Tags: dark mark remover, skin, skin care, turmeric | Price: 200.0",
  },
  {
    wordpress_id: 1133,
    type: "simple",
    name: "V-Pop",
    price: 60,
    description:
      "Vpop (boric acid inserts) treats yeast infections, balances vaginal pH, and promotes feminine hygiene.",
    categories: ["Health"],
    tags: ["vpop"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2022/12/IMG_2949-scaled.jpg",
    ],
    variations: [],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: V-Pop | Categories: Health | Tags: vpop | Price: 60.0",
  },
  {
    wordpress_id: 1135,
    type: "simple",
    name: "Pcos Pack",
    price: 200,
    description:
      "Balance hormones, reverse effects of PCOS, help with fertility and ovulation support.",
    categories: ["Health"],
    tags: ["fertility", "ovulation", "pcos"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2022/12/IMG_2948-scaled.jpg",
    ],
    variations: [],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: Pcos Pack | Categories: Health | Tags: fertility, ovulation, pcos | Price: 200.0",
  },
  {
    wordpress_id: 1137,
    type: "variable",
    name: "Yoni Steam Blend",
    price: 120,
    description:
      "Herbal yoni steam blend to cleanse, restore, and tone the vaginal area. Comes in 7 or 14 day packs.",
    categories: ["Feminine Care"],
    tags: ["yoni", "steam", "feminine health"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2023/04/IMG_0959-scaled.jpg",
    ],
    variations: [
      { variation_id: 2153, attributes: { Size: "7 days" }, price: 100 },
      { variation_id: 2154, attributes: { Size: "14 days" }, price: 180 },
    ],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: Yoni Steam Blend | Categories: Feminine Care | Tags: yoni, steam, feminine health | Price: from 100.0",
  },

  {
    wordpress_id: 1214,
    type: "booking",
    name: "Cavitation Session",
    price: 123.33,
    description:
      "Book a Cavitation Session — a non-invasive procedure for body contouring and fat reduction.",
    categories: ["Booking", "Service"],
    tags: ["cavitation", "body sculpting", "non-surgical"],
    images: [
      "https://dolledbynya.com/wp-content/uploads/2022/12/IMG_2065-scaled.jpg",
    ],
    variations: [],
    created_at: "2025-05-26T14:26:34Z",
    updated_at: "2025-05-26T14:26:34Z",
    all_info:
      "Product Name: Cavitation Session | Categories: Booking, Service | Tags: cavitation, body sculpting, non-surgical | Price: 123.33",
  },
];

export class ProductService {
  static async list(): Promise<Product[]> {
    return mockProducts;
  }

  static async getById(wordpress_id: number): Promise<Product | null> {
    return mockProducts.find((p) => p.wordpress_id === wordpress_id) || null;
  }
}
