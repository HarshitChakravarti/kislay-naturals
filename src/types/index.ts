export interface UserData {
  _id: string;
  username: string;
  name?: string;
  email: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Add other user properties as needed
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  confirmPassword: string;
}

export interface Review {
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
}

export type IconName = 'Leaf' | 'Award' | 'ShoppingBag' | 'Shield' | 'Users';

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface FeaturesBannerProps {
  features: Feature[];
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: Review[];
  numReviews?: number; // Total number of reviews
  avgRating?: number; // Average rating
  image: string;
  badge?: string;
  description?: string;
  category?: string;
  inStock?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id?: string;
  user: {
    name: string;
    mobile: string;
  };
  product: {
    id: string | number;
    name: string;
    price: number;
  };
  quantity: number;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentDetails: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
  orderStatus: 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}
