import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJSON } from '@/utils/fetchJSON';

// Orders API wrappers using relative URLs for Vercel compatibility
function apiCreateOrder(orderData: any) {
  return fetchJSON('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

function apiGetOrderById(orderId: string) {
  return fetchJSON(`/api/orders/${orderId}`);
}

function apiGetMyOrders() {
  return fetchJSON('/api/orders/my');
}

export const createNewOrder = createAsyncThunk(
  'orders/create',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const data = await apiCreateOrder(orderData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/details',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const data = await apiGetOrderById(orderId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/myOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGetMyOrders();
      return data.orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export interface OrderState {
  order: any | null;
  orders: any[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.order = payload.order;
      })
      .addCase(createNewOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
        state.success = false;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.order = payload.order;
      })
      .addCase(fetchOrderDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      // Fetch User Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload;
      })
      .addCase(fetchMyOrders.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { clearOrderError, resetOrderSuccess, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
