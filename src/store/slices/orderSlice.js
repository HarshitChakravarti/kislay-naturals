import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrder, getOrderById, getMyOrders } from '../../api/orders';

export const createNewOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await createOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/details',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await getOrderById(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/myOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMyOrders();
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    order: null,
    orders: [],
    loading: false,
    error: null,
    success: false,
  },
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
        state.error = payload;
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
        state.error = payload;
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
        state.error = payload;
      });
  },
});

export const { clearOrderError, resetOrderSuccess, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
