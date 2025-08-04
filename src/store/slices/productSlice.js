import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductById, createProduct } from '../../api/products';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getProducts(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getProductById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await createProduct(productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
