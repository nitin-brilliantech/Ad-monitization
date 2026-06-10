import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Toast from "../../../components/ui/toast/Toast";
import {
  getAllTierAPI,
  createTierAPI,
  updateTierAPI,
  deleteTierAPI
} from "../../../api/admin/configurations/location/location";

// Fetch tiers
export const fetchTier = createAsyncThunk(
  "tier/fetchTier",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllTierAPI(); // returns { success, data }
      return res;
    } catch (err) {
      Toast.error("Failed to fetch tiers");
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

// Create tier
export const createTier = createAsyncThunk(
  "tier/createTier",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createTierAPI(payload); // returns { success, data }
      Toast.success("Tier added successfully");
      return res;
    } catch (err) {
      Toast.error("Failed to add tier");
      return rejectWithValue(err.response?.data || "Create failed");
    }
  }
);

// Update tier
export const updateTier = createAsyncThunk(
  "tier/updateTier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateTierAPI(data, id); // returns { success, data }
      Toast.success("Tier updated successfully");
      return res;
    } catch (err) {
      Toast.error("Failed to update tier");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// Delete tier
export const deleteTier = createAsyncThunk(
  "tier/deleteTier",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTierAPI(id); // returns { success, message }
      Toast.success("Tier deleted successfully");
      return id;
    } catch (err) {
      Toast.error("Failed to delete tier");
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const tierSlice = createSlice({
  name: "tier",
  initialState: {
    tiers: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false, 
  },
  reducers: {
    resetTierFetched(state) {
      state.fetched = false; 
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTier.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
        state.fetched = true;
      })
      .addCase(fetchTier.rejected, (state, action) => {
        state.loading = false;
        state.tiers = [];
        state.error = action.payload;
        state.fetched = true;
      })

      // Create
      .addCase(createTier.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createTier.fulfilled, (state, action) => {
        state.formLoading = false;
        if (action.payload?.data) {
          state.tiers.push(action.payload.data);
        }
      })
      .addCase(createTier.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateTier.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateTier.fulfilled, (state, action) => {
        state.formLoading = false;
        const updated = action.payload?.data;
        if (updated) {
          const index = state.tiers.findIndex((t) => t.id === updated.id);
          if (index !== -1) {
            state.tiers[index] = updated;
          }
        }
      })
      .addCase(updateTier.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTier.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(deleteTier.fulfilled, (state, action) => {
        state.formLoading = false;
        state.tiers = state.tiers.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTier.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTierFetched } = tierSlice.actions;

export default tierSlice.reducer;