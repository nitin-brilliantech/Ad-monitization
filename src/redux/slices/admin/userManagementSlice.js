import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsersAPI,
  createUserAPI,
  toggleUserStatusAPI,
} from "../../../api/admin/user-management/userManagementApi";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsersAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetch users failed");
    }
  }
);

// Create a new user
export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createUserAPI(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Create user failed");
    }
  }
);

// Toggle status (ACTIVE/INACTIVE) — optimistic update in slice
export const toggleUserStatus = createAsyncThunk(
  "user/toggleUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await toggleUserStatusAPI(id, status);
      return { id, status };
    } catch (error) {
      return rejectWithValue({ id, error: error.response?.data || "Status update failed" });
    }
  }
);

const usersManagementSlice = createSlice({
  name: "usersManagement",
  initialState: {
    users: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false, // <-- Added fetched flag
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.fetched = true; // <-- Set fetched = true on success
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true; // <-- Reset on failure
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.formLoading = false;
        if (action.payload?.data) {
          state.users.push(action.payload.data); // Add new user to list
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // Toggle User Status — optimistic: flip immediately, revert on failure
      .addCase(toggleUserStatus.pending, (state, action) => {
        const { id, status } = action.meta.arg;
        const index = state.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          state.users[index].status = status; // flip instantly
        }
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        // already flipped in pending — just ensure it's in sync
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index].status = action.payload.status;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        // revert — flip back to the previous status
        const { id, status } = action.meta.arg;
        const previous = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const index = state.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          state.users[index].status = previous;
        }
      });
  },
});

export default usersManagementSlice.reducer;