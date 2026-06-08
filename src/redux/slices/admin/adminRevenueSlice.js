import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllRevenueHistory } from "../../../api/admin/admin-api/admin-revenue"; 
// adjust path if needed

// Thunk to fetch revenue data
export const getAllRevenueHistory = createAsyncThunk(
  "adminRevenue/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllRevenueHistory();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch revenue history"
      );
    }
  }
);

const adminRevenueSlice = createSlice({
  name: "adminRevenue",
  initialState: {
    revenueHistory: [],
    loading: false,
    error: null,
    success: false,   // indicates if last request was successful
    fetched: false,   // indicates if data was fetched at least once
  },
  reducers: {
    clearRevenueError: (state) => {
      state.error = null;
    },
    resetRevenueState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.fetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRevenueHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllRevenueHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueHistory = action.payload;
        state.success = true;
        state.fetched = true;
      })
      .addCase(getAllRevenueHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.fetched = true;
      });
  },
});

export const { clearRevenueError, resetRevenueState } = adminRevenueSlice.actions;

export default adminRevenueSlice.reducer;
