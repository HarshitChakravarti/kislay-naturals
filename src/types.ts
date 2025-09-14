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

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // primary image URL
  badge?: string;
  originalPrice?: number;
  rating?: number;
  numReviews?: number;
  inStock?: boolean;
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
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentDetails: {
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
  user?: string; // user id/email
  items?: OrderItem[];
  total?: number;
  status?: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
};
