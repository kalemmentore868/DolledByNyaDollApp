export type Variation = {
  variation_id: number;
  attributes: {
    [key: string]: string; // e.g. "Size": "7 days" or "equipment": "with wax kit"
  };
  price: number;
};

export interface Product {
  _id: string;
  wordpress_id: number;
  type: "simple" | "variable" | "booking";
  name: string;
  price: number | string;
  description: string;
  categories: string[]; // e.g. ['Supplements']
  tags: string[]; // e.g. ['detox', 'skin care']
  images: string[]; // array of image URLs
  variations: Variation[]; // extend if using later
  created_at: string; // ISO string
  updated_at: string; // ISO string
  all_info: string; // combined preview text (optional)
}
