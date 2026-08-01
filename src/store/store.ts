import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice';

// Define the root state type
const rootReducer = {
  
  cart: cartReducer,
 
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
