// Central app types for API and UI

export type IconName = 'Leaf' | 'Zap' | 'Smile' | 'CheckCircle' | 'Users';

export type Feature = {
  title: string;
  description: string;
  icon: IconName;
};

export type FeaturesBannerProps = {
  features: Feature[];
};

export type UserData = {
  _id: string;
  username: string;
  name?: string;
  email: string;
  role?: string; // Added role for admin functionality
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Add other user properties as needed
};

export type AuthResponse = {
  success: boolean;
  message: string;
  user?: UserData;
  token?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export interface RegisterData extends LoginCredentials {
  username: string;
  confirmPassword: string;
}

export type Review = {
  id: string | number;
  user: {
    id: string;
    name?: string;
    username: string;
  };
  rating: number;
  comment?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
};

export type ProductVariant = {
  size: string; // e.g., "10ml", "30ml"
  price: number; // selling price
  originalPrice: number; // slashed price
  image?: string; // variant-specific hero image
  unitCount?: number; // number of 10ml units in a bundle
};

export type Product = {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  variants?: ProductVariant[]; // Array of product variants (10ml, 30ml, etc.)
  reviews?: Review[];
  numReviews?: number; // Total number of reviews
  avgRating?: number; // Average rating
  image: string; // primary image URL
  badge?: string;
  category?: string;
  sku?: string; // Stock keeping unit
  inStock?: boolean;
  slug?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type OrderDetails = {
  user: {
    name: string;
    email: string;
    mobile: string;
  };
  product?: Product; // Make optional to support cart checkout
  cartItems?: any[]; // Allow cart checkout payload
  quantity?: number; // Make optional
  totalAmount: number;
  originalPrice?: number;
  discountedPrice?: number;
  couponCode?: string | null;
  couponDiscount?: number;
  shippingAddress: Address;
  paymentDetails?: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
};

// Generic Order stored in Supabase `orders`
export type OrderItem = {
  product: string; // product id
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

export type Order = {
  id?: string;
  _id?: string; // MongoDB compatibility
  user?: string; // user id/email
  items?: OrderItem[];
  total?: number;
  totalAmount?: number; // For compatibility with existing OrderDetails
  status?: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus?: 'paid' | 'shipped' | 'delivered' | 'cancelled'; // For compatibility
  shippingAddress?: Address;
  paymentDetails?: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
