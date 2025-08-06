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

export interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: any[];  // This will be replaced with review objects
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
