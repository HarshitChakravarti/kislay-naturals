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

// Products API wrappers using relative URLs
function apiGetProducts(params) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchJSON(`/api/products${query}`);
}

function apiGetProductById(id) {
  return fetchJSON(`/api/products/${id}`);
}

function apiCreateProduct(productData) {
  return fetchJSON('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await apiGetProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiGetProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const data = await apiCreateProduct(productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    resetProductSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.product = payload.product;
      })
      .addCase(fetchProductDetails.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Add New Product
      .addCase(addNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addNewProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.products.unshift(payload.product);
      })
      .addCase(addNewProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
      });
  },
});

export const { clearProductError, resetProductSuccess } = productSlice.actions;
export default productSlice.reducer;
