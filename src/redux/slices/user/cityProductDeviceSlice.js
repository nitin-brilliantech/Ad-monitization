import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDropDownDataAPI } from '../../../api/user/campaign-api/targetingOptionService';

export const fetchDropdownData = createAsyncThunk(
  'dropdown/fetchDropdownData',
  async () => {
    const dropdownData = await getDropDownDataAPI();
    return dropdownData;  // { products, locations, devices }
  }
);

const cityProductDevice = createSlice({
  name: 'cityProductDevice',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDropdownData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // payload is already dropdown data
      })
      .addCase(fetchDropdownData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearDropdownData } = cityProductDevice.actions;

export default cityProductDevice.reducer;
