import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

// Define the root state type
const rootReducer = {
  products: productReducer,
  cart: cartReducer,
  order: orderReducer,
};

// Create a function to make a new store
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Export types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
