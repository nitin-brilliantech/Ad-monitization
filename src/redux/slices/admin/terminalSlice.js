import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllRequestAPI,
  updateRequestStatusAPI,
  getAllDevicesAPI,
  updateDeviceCountAPI,
} from "../../../api/admin/terminal/device";

// Thunks
export const fetchRequests = createAsyncThunk(
  "terminal/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllRequestAPI();

      // Map response to frontend-friendly structure
      const mapped = response?.map((req) => {
        const address = req.address || {};
        const regions = Array.isArray(address.region)
          ? address.region.map((r) => r.name).join(", ")
          : address.region?.name || "";

        return {
          id: req.id,
          name: req.deviceName,
          qty: req.qty,
          country: address.country || "",
          state: address.state || "",
          city: address.city || "",
          regions,
          startDate: new Date(req.createdAt).toLocaleDateString(),
          status: req.status,
          remarks: req.remarks,
          retailerName: req.retailerName || "",
        };
      });

      return mapped;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  "terminal/updateRequestStatus",
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      await updateRequestStatusAPI(id, status, remark);
      return { id, status, remark };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Thunks
export const fetchDevices = createAsyncThunk(
  "terminal/fetchDevices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllDevicesAPI();

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update device count
export const updateDeviceCount = createAsyncThunk(
  "terminal/updateDeviceCount",
  async (
    { deviceId, retailerId, activeDevices, inactiveDevices },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateDeviceCountAPI(deviceId, {
        retailerId,
        activeDevices,
        inactiveDevices,
      });
      return response; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const terminalSlice = createSlice({
  name: "terminal",
  initialState: {
    deviceRequests: [],
    loading: false,
    formLoading: false,
    error: null,
    fetched: false,

    devices: [],
    deviceLoading: false,
    deviceFormLoading: false,
    deviceError: null,
    deviceFetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch requests
      .addCase(fetchDevices.pending, (state) => {
        state.deviceLoading = true;
        state.deviceError = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.deviceLoading = false;
        state.devices = action.payload || [];
        state.deviceFetched = true;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.deviceLoading = false;
        state.deviceError = action.payload || "Failed to fetch devices";
        state.deviceFetched = true;
      });

    builder
      // fetch requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.deviceRequests = action.payload || [];
        state.fetched = true;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch device requests";
        state.fetched = true;
      })

      // update request status
      .addCase(updateRequestStatus.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.formLoading = false;
        const { id, status, remark } = action.payload;
        const idx = state.deviceRequests.findIndex((r) => r.id === id);
        if (idx !== -1) {
          state.deviceRequests[idx].status = status;
          if (remark !== undefined) state.deviceRequests[idx].remarks = remark;
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to update device request";
      });
    builder

      // Update device count
      .addCase(updateDeviceCount.fulfilled, (state, action) => {
        state.deviceFormLoading = false;
        const updatedDevice = action.payload;

        state.devices = state.devices.map((retailer) => {
          if (retailer.userId === updatedDevice.userId) {
            return {
              ...retailer,
              devices: retailer.devices.map((d) =>
                d.id === updatedDevice.deviceId 
                  ? {
                      ...d,
                      activeDevices: updatedDevice.activeDevices,
                      inactiveDevices: updatedDevice.inactiveDevices,
                      totalDevices: updatedDevice.totalDevices,
                      status: updatedDevice.status,
                    }
                  : d
              ),
            };
          }
          return retailer;
        });
      })

      .addCase(updateDeviceCount.rejected, (state, action) => {
        state.deviceFormLoading = false;
        state.deviceError = action.payload || "Failed to update device count";
      });
  },
});

export default terminalSlice.reducer;
