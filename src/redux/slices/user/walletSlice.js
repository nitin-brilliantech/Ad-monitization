// src/store/slices/walletSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWalletBalanceAPI,
  createWithdrawalRequestAPI,
  getWithdrawalRequestsAPI,
  cancelWithdrawalRequestAPI,
} from "../../../api/user/wallets-api/wallet-api";

export const fetchWalletBalance = createAsyncThunk(
  "wallet/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWalletBalanceAPI();
      if (!response.data?.data?.balance) {
        throw new Error("Invalid response structure");
      }
      return response.data.data.balance;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch balance";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createWithdrawalRequest = createAsyncThunk(
  "wallet/createWithdrawalRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createWithdrawalRequestAPI(data);
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Withdrawal request failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchWithdrawalRequests = createAsyncThunk(
  "wallet/fetchWithdrawalRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWithdrawalRequestsAPI();
      return response.data; // assuming API returns { data: [...] }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch withdrawal requests";
      return rejectWithValue(errorMessage);
    }
  }
);

export const cancelWithdrawalRequest = createAsyncThunk(
  "wallet/cancelWithdrawalRequest",
  async (walletId, { rejectWithValue }) => {
    try {
      const response = await cancelWithdrawalRequestAPI(walletId);
      return { walletId, response: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel withdrawal request";
      return rejectWithValue(errorMessage);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 0,
    loading: false, // for balance fetching
    formLoading: false, // for form submissions
    withdrawalLoading: false, // for fetching requests
    cancellationLoading: false, // for cancel request
    error: null,
    withdrawalError: null,
    cancellationError: null,
    withdrawalRequests: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch wallet balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create withdrawal request (form)
      .addCase(createWithdrawalRequest.pending, (state) => {
        state.formLoading = true;
        state.withdrawalError = null;
      })
      .addCase(createWithdrawalRequest.fulfilled, (state) => {
        state.formLoading = false;
      })
      .addCase(createWithdrawalRequest.rejected, (state, action) => {
        state.formLoading = false;
        state.withdrawalError = action.payload;
      })

      // fetch withdrawal requests (table/list)
      .addCase(fetchWithdrawalRequests.pending, (state) => {
        state.withdrawalLoading = true;
        state.withdrawalError = null;
      })
      .addCase(fetchWithdrawalRequests.fulfilled, (state, action) => {
        state.withdrawalLoading = false;
        state.withdrawalRequests = action.payload || [];
      })
      .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
        state.withdrawalLoading = false;
        state.withdrawalError = action.payload;
      })

      // cancel withdrawal request
      .addCase(cancelWithdrawalRequest.pending, (state) => {
        state.cancellationLoading = true;
        state.cancellationError = null;
      })
      .addCase(cancelWithdrawalRequest.fulfilled, (state, action) => {
        state.cancellationLoading = false;
        if (state.withdrawalRequests) {
          state.withdrawalRequests = state.withdrawalRequests.map((request) =>
            request.walletId === action.payload.walletId
              ? { ...request, status: "REJECTED" }
              : request
          );
        }
      })
      .addCase(cancelWithdrawalRequest.rejected, (state, action) => {
        state.cancellationLoading = false;
        state.cancellationError = action.payload;
      });
  },
});

export default walletSlice.reducer;



// // src/store/slices/walletSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getWalletBalanceAPI, createWithdrawalRequestAPI, getWithdrawalRequestsAPI ,cancelWithdrawalRequestAPI} from "../../api/wallets-api/wallet-api";

// export const fetchWalletBalance = createAsyncThunk(
//   "wallet/fetchBalance",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getWalletBalanceAPI();
//       if (!response.data?.data?.balance) {
//         throw new Error("Invalid response structure");
//       }
//       return response.data.data.balance;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch balance";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// export const createWithdrawalRequest = createAsyncThunk(
//   "wallet/createWithdrawalRequest",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createWithdrawalRequestAPI(data);
//       return response;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Withdrawal request failed";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// export const fetchWithdrawalRequests = createAsyncThunk(
//   "wallet/fetchWithdrawalRequests",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getWithdrawalRequestsAPI();
//       return response.data; // assuming API returns { data: [...] }

//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch withdrawal requests";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// export const cancelWithdrawalRequest = createAsyncThunk(
//   "wallet/cancelWithdrawalRequest",
//   async (walletId, { rejectWithValue }) => {
//     try {
//       const response = await cancelWithdrawalRequestAPI(walletId);
//       return { walletId, response: response.data };
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to cancel withdrawal request";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );


// const walletSlice = createSlice({
//   name: "wallet",
//   initialState: {
//     balance: 0,
//     loading: false,
//     formLoading:false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       //fetch wallet balance
//       .addCase(fetchWalletBalance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchWalletBalance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.balance = action.payload;
//       })
//       .addCase(fetchWalletBalance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Withdrawal request
//       .addCase(createWithdrawalRequest.pending, (state) => {
//         state.withdrawalLoading = true;
//         state.withdrawalError = null;
//       })
//       .addCase(createWithdrawalRequest.fulfilled, (state) => {
//         state.withdrawalLoading = false;
//       })
//       .addCase(createWithdrawalRequest.rejected, (state, action) => {
//         state.withdrawalLoading = false;
//         state.withdrawalError = action.payload;
//       })

//       // Withdrawal requests
//       .addCase(fetchWithdrawalRequests.pending, (state) => {
//         state.withdrawalLoading = true;
//         state.withdrawalError = null;
//       })
//       .addCase(fetchWithdrawalRequests.fulfilled, (state, action) => {
//         state.withdrawalLoading = false;
//         state.withdrawalRequests = action.payload || [];
//       })
//       .addCase(fetchWithdrawalRequests.rejected, (state, action) => {
//         state.withdrawalLoading = false;
//         state.withdrawalError = action.payload;
//       })

//       // Cancel Withdrawal Request
//       .addCase(cancelWithdrawalRequest.pending, (state) => {
//         state.cancellationLoading = true;
//         state.cancellationError = null;
//       })
//       .addCase(cancelWithdrawalRequest.fulfilled, (state, action) => {
//         state.cancellationLoading = false;
//         // Update the specific request's status locally
//         if (state.withdrawalRequests) {
//           state.withdrawalRequests = state.withdrawalRequests.map(request =>
//             request.walletId === action.payload.walletId
//               ? { ...request, status: "REJECTED" }
//               : request
//           );
//         }
//       })
//       .addCase(cancelWithdrawalRequest.rejected, (state, action) => {
//         state.cancellationLoading = false;
//         state.cancellationError = action.payload;
//       });
//   },
// });

// export default walletSlice.reducer;
