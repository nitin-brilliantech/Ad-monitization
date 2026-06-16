import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllDevicesAPI,
  getAllRequestAPI,
  createRequestAPI,
  updateRequestAPI,
  deleteRequestAPI,
} from "../../../api/user/terminal/device";

// ================== ASYNC THUNKS ==================

// Fetch all devices
export const fetchDevices = createAsyncThunk(
  "terminal/fetchDevices",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllDevicesAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch all device requests
export const fetchRequests = createAsyncThunk(
  "terminal/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllRequestAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create request
export const createRequest = createAsyncThunk(
  "terminal/createRequest",
  async (data, { rejectWithValue }) => {
    try {
      // 🔑 Only return normalized "data"
      const res = await createRequestAPI(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update request
export const updateRequest = createAsyncThunk(
  "terminal/updateRequest",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateRequestAPI(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete request
export const deleteRequest = createAsyncThunk(
  "terminal/deleteRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteRequestAPI(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ================== SLICE ==================
const terminalSlice = createSlice({
  name: "terminal",
  initialState: {
    devices: [],
    deviceRequests: [],

    devicesLoading: false,
    devicesFetched: false,
    requestsLoading: false,
    requestsFetched: false,

    formLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // ===== Devices =====
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.devicesLoading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.devicesLoading = false;
        state.devices = action.payload || [];
        state.devicesFetched = true;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.devicesLoading = false;
        state.error = action.payload || "Failed to fetch devices";
      });

    // ===== Device Requests =====
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.requestsLoading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.deviceRequests = action.payload || [];
        state.requestsFetched = true;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.error = action.payload || "Failed to fetch requests";
      });

    // ===== Create Request =====
    builder
      .addCase(createRequest.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.formLoading = false;

        // ✅ normalize response in case API wraps it
        const newReq = action.payload?.data || action.payload;

        if (newReq) {
          state.deviceRequests.push(newReq);
        }
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to create request";
      });

    // ===== Update Request =====
    builder
      .addCase(updateRequest.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.formLoading = false;
        const updated = action.payload?.data || action.payload;
        const index = state.deviceRequests.findIndex(
          (r) => r.id === updated.id
        );
        if (index !== -1) state.deviceRequests[index] = updated;
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to update request";
      });

    // ===== Delete Request =====
    builder
      .addCase(deleteRequest.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.formLoading = false;
        const deletedId = action.meta.arg;
        state.deviceRequests = state.deviceRequests.filter(
          (r) => r.id !== deletedId
        );
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to delete request";
      });
  },
});

export default terminalSlice.reducer;