import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to handle fetch with JSON and errors
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed with ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// Orders API wrappers using relative URLs for Vercel compatibility
function apiCreateOrder(orderData) {
  return fetchJSON('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

function apiGetOrderById(orderId) {
  return fetchJSON(`/api/orders/${orderId}`);
}

function apiGetMyOrders() {
  return fetchJSON('/api/orders/my');
}

export const createNewOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await apiCreateOrder(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/details',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await apiGetOrderById(orderId);
      return data;
    } catch (error) {
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
    } catch (error) {
      return rejectWithValue(error.message);
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
