import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserApi,
  getUserProfileAPI,
  updateUserProfileAPI,
  resetUserPasswordAPI,
} from "../../../api/user/user/user-api";

// ==================== Async Thunks ====================

// Login user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);
      const { token, user } = response;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserProfileAPI();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      return await updateUserProfileAPI(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Reset password
export const resetUserPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      return await resetUserPasswordAPI({ currentPassword, newPassword });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);

// ==================== Initial State ====================
const initialState = {
  user: null,                // full profile
  token: localStorage.getItem("token") || null, // persist token
  loading: false,            // for fetching profile
  formLoading: false,        // for login/update/reset
  error: null,
  successMessage: null,
};

// ==================== Slice ====================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.successMessage = null;
      localStorage.clear();
    },
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // ===== Login =====
    builder
      .addCase(loginUser.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.formLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null; // if login API has profile
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });

    // ===== Fetch Profile =====
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // always full profile
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== Update Profile =====
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.formLoading = false;
        state.user = action.payload; // updated profile
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });

    // ===== Reset Password =====
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.formLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.formLoading = false;
        state.successMessage = action.payload?.message || "Password reset successful!";
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearUserMessages } = userSlice.actions;
export default userSlice.reducer;