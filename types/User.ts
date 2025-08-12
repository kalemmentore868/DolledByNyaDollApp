/* ------------------------------------------------------------------ */
/*  Primitive helpers                                                 */
/* ------------------------------------------------------------------ */

export type ObjectId = string; // Mongo _id as 24-char hex string
export type ISODate = string; // e.g. "2025-05-30T14:23:00Z"

/* ------------------------------------------------------------------ */
/*  Address (embedded)                                                */
/* ------------------------------------------------------------------ */

export interface Address {
  label?: "home" | "work" | "other";
  line_1: string;
  line_2?: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string; // ISO-3166 alpha-2 ("TT", "US", …)
  phone?: string; // E.164  +1868…
  is_default?: boolean;
}

/* ------------------------------------------------------------------ */
/*  User document                                                     */
/* ------------------------------------------------------------------ */

export interface User {
  _id: ObjectId; // _id

  // Clerk / auth
  clerk_user_id: string;
  email: string;

  // profile
  name: string;
  avatar_url?: string;
  phone?: string;
  birth_date?: ISODate | null; // null when not set

  // addresses & wishlist
  addresses?: Address[];
  default_address_id?: ObjectId;

  // e-commerce
  cart_id?: ObjectId;
  wishlist?: ObjectId[];
  referral_code?: string;
  loyalty_points: number; // always present (≥0)

  // ops / RBAC
  role: "customer" | "admin";
  last_login_at?: ISODate | null;

  // timestamps
  created_at: ISODate;
  updated_at: ISODate;
}

/* ------------------------------------------------------------------ */
/*  Role helper constants (optional)                                  */
/* ------------------------------------------------------------------ */

export const RoleCustomer = "customer" as const;
export const RoleAdmin = "admin" as const;
export type Role = typeof RoleCustomer | typeof RoleAdmin;

export interface CreateUser {
  clerk_user_id: string;
  email: string;
  name: string;
  addresses: Address[];
}

export type UpdateUser = Partial<{
  name: string;
  avatar_url: string;
  phone: string;
  birth_date: ISODate | null;

  // addresses & wishlist
  addresses: Address[];
  default_address_id: ObjectId;
  wishlist: ObjectId[];

  // extras a customer may modify
  referral_code: string;
}>;
