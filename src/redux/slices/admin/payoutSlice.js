
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchWithdrawalRequestAPI,
  makePayoutAPI,
  updateWithdrawStatusAPI,
} from "../../../api/admin/payout/payout-api";

// Thunks
export const fetchPayouts = createAsyncThunk(
  "payouts/fetchPayouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithdrawalRequestAPI();
      return response.data; // API returns { success, message, status, data: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const makePayout = createAsyncThunk(
  "payouts/makePayout",
  async (id, { rejectWithValue }) => {
    try {
      const response = await makePayoutAPI(id);
      return { id, updated: response.data }; // expect updated payout object
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateWithdrawStatus = createAsyncThunk(
  "payouts/updateWithdrawStatus",
  async ({ id, status, remark }) => {
    await updateWithdrawStatusAPI(id, status, remark); // pass remark to API
    return { id, status, remark };
  }
);

// export const updateWithdrawStatus = createAsyncThunk(
//   "payouts/updateWithdrawStatus",
//   async ({ id, status }) => {
//     await updateWithdrawStatusAPI(id, status);
//     return { id, status };
//   }
// );


// Slice
const payoutSlice = createSlice({
  name: "payouts",
  initialState: {
    payouts: [],
    loading: false,
    formLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch payouts
      .addCase(fetchPayouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload || []; // API gives array in .data
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch payouts";
      })

      // Make payout (update existing row to paid)
      .addCase(makePayout.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(makePayout.fulfilled, (state, action) => {
        state.formLoading = false;
        const { id, updated } = action.payload;
        const idx = state.payouts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          state.payouts[idx] = { ...state.payouts[idx], ...updated };
        }
      })
      .addCase(makePayout.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to make payout";
      })

      // Update withdraw status
      .addCase(updateWithdrawStatus.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateWithdrawStatus.fulfilled, (state, action) => {
        state.formLoading = false; // ✅ fix
        const { id, status, remark } = action.payload;
        const idx = state.payouts.findIndex((p) => p.id === id);
        if (idx !== -1) {
          state.payouts[idx].isApproved = status;
          if (remark !== undefined) {
            state.payouts[idx].remark = remark;
          }
        }
      })



      // .addCase(updateWithdrawStatus.fulfilled, (state, action) => {
      //   state.formLoading = false;
      //   const { withdraw_id, updated } = action.payload;
      //   const idx = state.payouts.findIndex((p) => p.id === withdraw_id);
      //   if (idx !== -1) {
      //     state.payouts[idx] = { ...state.payouts[idx], ...updated };
      //   }
      // })
      .addCase(updateWithdrawStatus.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to update withdraw status";
      });
  },
});

export default payoutSlice.reducer;