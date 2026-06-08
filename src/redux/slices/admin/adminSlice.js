import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserApi,
  getAdminProfile,
  updateUserProfile,
  resetUserPassword,
  fetchUserAPI,
  getRevenue,
} from "../../../api/admin/admin-api/admin-api";

// ==================== Async Thunks ====================

// Admin login
export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);
      const { token, user } = response;

      // Persist token
      localStorage.setItem("adminToken", token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Fetch self (basic user info)
export const fetchAdmin = createAsyncThunk(
  "admin/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch full admin profile
export const fetchAdminProfile = createAsyncThunk(
  "admin/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch profile failed");
    }
  }
);

// Update profile
export const updateAdminProfile = createAsyncThunk(
  "admin/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      return await updateUserProfile(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// Reset password
export const resetAdminPassword = createAsyncThunk(
  "admin/resetPassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      return await resetUserPassword({ currentPassword, newPassword });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Reset password failed");
    }
  }
);

// Fetch revenue
export const fetchRevenue = createAsyncThunk(
  "admin/fetchRevenue",
  async (_, { rejectWithValue }) => {
    try {
      return await getRevenue();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch revenue");
    }
  }
);

// ==================== Initial State ====================
const initialState = {
  user: null,                                
  token: localStorage.getItem("adminToken") || null,
  revenue: null,               
  loading: false,              // for global fetches
  formLoading: false,          // for forms (login/update/reset)
  error: null,
  successMessage: null,
};

// ==================== Slice ====================
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.user = null;
      state.token = null;
      state.revenue = null;
      state.error = null;
      state.successMessage = null;
      // localStorage.removeItem("token");
      localStorage.clear()
    },
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // ===== Login =====
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.formLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });

    // ===== Fetch Admin =====
    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Fetch Profile =====
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Update Profile =====
    builder
      .addCase(updateAdminProfile.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.formLoading = false;
        state.user = action.payload;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });

    // ===== Reset Password =====
    builder
      .addCase(resetAdminPassword.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetAdminPassword.fulfilled, (state, action) => {
        state.formLoading = false;
        state.successMessage =
          action.payload?.message || "Password reset successful!";
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });

    // ===== Fetch Revenue =====
    builder
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin, clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;