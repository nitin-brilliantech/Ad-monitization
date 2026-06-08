import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getAllProductAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from "../../../api/admin/configurations/product/product";

// Fetch products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllProductAPI(); // returns { success, data }
      return res;
    } catch (err) {
      toast.error("Failed to fetch products");
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createProductAPI(payload); // returns { success, data }
      toast.success("Product added successfully");
      return res;
    } catch (err) {
      toast.error("Failed to add product");
      return rejectWithValue(err.response?.data || "Create failed");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateProductAPI(data, id); // returns { success, data }
      toast.success("Product updated successfully");
      return res;
    } catch (err) {
      toast.error("Failed to update product");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductAPI(id); // returns { success, message }
      toast.success("Product deleted successfully");
      return id; // return id for removing from state
    } catch (err) {
      toast.error("Failed to delete product");
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false, // <-- added fetched flag here
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
        state.fetched = true; // <-- set fetched true on success
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.payload;
        state.fetched = true; // reset fetched on failure
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.formLoading = false;
        if (action.payload?.data) {
          state.products.push(action.payload.data);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.formLoading = false;
        const updated = action.payload?.data;
        if (updated) {
          const index = state.products.findIndex((p) => p.id === updated.id);
          if (index !== -1) {
            state.products[index] = updated;
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.formLoading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;