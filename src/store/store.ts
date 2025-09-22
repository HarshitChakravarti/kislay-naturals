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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Create the store instance
export const store = makeStore();

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = typeof store.dispatch;
