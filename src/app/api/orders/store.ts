// Shared in-memory store for demo purposes (not for production)
export type OrderItem = {
  product: string; // product id
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  user?: string; // user id/email (optional)
  status?: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
};

export const demoOrders: Order[] = [];
