import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types';
import { fetchJSON } from '@/utils/fetchJSON';

// Products API wrappers using relative URLs
function apiGetProducts(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchJSON(`/api/products${query}`);
}

function apiGetProductById(id: string) {
  return fetchJSON(`/api/products/${id}`);
}

function apiCreateProduct(productData: any) {
  return fetchJSON('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      const data = await apiGetProducts(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await apiGetProductById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/create',
  async (productData: any, { rejectWithValue }) => {
    try {
      const data = await apiCreateProduct(productData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
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
        state.error = payload as string;
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
        state.error = payload as string;
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
        state.error = payload as string;
        state.success = false;
      });
  },
});

export const { clearProductError, resetProductSuccess } = productSlice.actions;
export default productSlice.reducer;
