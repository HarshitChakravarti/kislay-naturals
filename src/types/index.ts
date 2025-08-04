export interface UserData {
  _id: string;
  username: string;
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
