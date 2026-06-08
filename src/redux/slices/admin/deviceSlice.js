import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getDevicesAPI,
  createDeviceAPI,
  updateDeviceAPI,
  deleteDeviceAPI,
  getDeviceByIdOrNameAPI
} from "../../../api/admin/configurations/device/device";

// Fetch devices
export const fetchDevices = createAsyncThunk(
  "device/fetchDevices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getDevicesAPI(); // { message, data: [...] }
      return res.data; // only return the array
    } catch (err) {
      toast.error("Failed to fetch devices");
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

// Create device
export const createDevice = createAsyncThunk(
  "device/createDevice",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createDeviceAPI(payload); // { message, data: {...} }
      toast.success("Device added successfully");
      return res.data; // return only the new device object
    } catch (err) {
      toast.error("Failed to add device");
      return rejectWithValue(err.response?.data || "Create failed");
    }
  }
);

// Update device
export const updateDevice = createAsyncThunk(
  "device/updateDevice",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateDeviceAPI(id, data); // { message, data: {...} }
      toast.success("Device updated successfully");
      return res.data;
    } catch (err) {
      toast.error("Failed to update device");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// Delete device
export const deleteDevice = createAsyncThunk(
  "device/deleteDevice",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDeviceAPI(id);
      toast.success("Device deleted successfully");
      return id; // return only the id
    } catch (err) {
      toast.error("Failed to delete device");
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

// Get device by ID or Name
export const getDeviceByIdOrName = createAsyncThunk(
  "device/getDeviceByIdOrName",
  async (identifier, { rejectWithValue }) => {
    try {
      const res = await getDeviceByIdOrNameAPI(identifier); // { message, data: {...} }
      return res.data;
    } catch (err) {
      toast.error("Device not found");
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

const deviceSlice = createSlice({
  name: "device",
  initialState: {
    devices: [],
    loading: false,      // For fetches/list loading
    formLoading: false,  // For create/update/delete form submissions
    error: null,
    selectedDevice: null,
    fetched: false,      // NEW: track if devices have been fetched already
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch devices
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = Array.isArray(action.payload) ? action.payload : [];
        state.fetched = true;  // Set fetched to true on successful fetch
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.devices = [];
        state.error = action.payload;
        state.fetched = true;  // reset fetched flag if fetch fails
      })

      // The rest remains exactly as you wrote it
      .addCase(createDevice.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.formLoading = false;
        if (action.payload) state.devices.push(action.payload);
      })
      .addCase(createDevice.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(updateDevice.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        state.formLoading = false;
        const index = state.devices.findIndex(d => d.id === action.payload?.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
        }
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteDevice.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.formLoading = false;
        state.devices = state.devices.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      .addCase(getDeviceByIdOrName.pending, (state) => {})
      .addCase(getDeviceByIdOrName.fulfilled, (state, action) => {
        state.selectedDevice = action.payload || null;
      })
      .addCase(getDeviceByIdOrName.rejected, (state, action) => {
        state.selectedDevice = null;
        state.error = action.payload;
      });
  },
});

export default deviceSlice.reducer;