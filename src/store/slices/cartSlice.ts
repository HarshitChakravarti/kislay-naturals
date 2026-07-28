import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CartItem {
  product: string | number; // product id
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantSize?: string;
}

export interface ShippingAddress {
  flat?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  _hasHydrated: boolean;
}

const initialState: CartState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: '',
  _hasHydrated: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart: (state) => {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) state.cartItems = JSON.parse(storedItems);
        
        const storedAddress = localStorage.getItem('shippingAddress');
        if (storedAddress) state.shippingAddress = JSON.parse(storedAddress);
        
        const storedPayment = localStorage.getItem('paymentMethod');
        if (storedPayment) state.paymentMethod = storedPayment;
        
        state._hasHydrated = true;
      }
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      }
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentMethod', action.payload);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartItems');
      }
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.cartItems;

export const selectCartItemsCount = (state: RootState) =>
  state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);

export const selectCartSubtotal = (state: RootState) =>
  state.cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
