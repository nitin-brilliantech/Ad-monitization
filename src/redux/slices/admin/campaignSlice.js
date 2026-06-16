import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCampaignAPI,
  getCampaignsAPI,
  toggleCampaignStatusAPI,
  campaignApprovalApi,
  getCampaignPaymentHistoryAPI,
  getCampaignRevenueRequestAPI,
  transferRevenueAPI,
} from "../../../api/admin/campaign-api/campaignService";
import { createSelector } from "@reduxjs/toolkit";
import Toast from "../../../components/ui/toast/Toast";

export const selectSortedCampaigns = createSelector(
  (state) => state.campaign.campaigns,
  (campaigns) =>
    [...campaigns].sort((a, b) => {
      const updatedDiff = new Date(b.updatedAt) - new Date(a.updatedAt);
      if (updatedDiff !== 0) return updatedDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
);

export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createCampaignAPI(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCampaignsAPI();

      if (response.length === 0) {
        Toast.info("No campaigns found.");
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const campaignApproval = createAsyncThunk(
  "campaign/campaignApproval",
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      const payload = { isApproved: status };
      if (status === "REJECT" && remark) {
        payload.remark = remark;
      }

      await campaignApprovalApi(id, payload);
      if (status === "APPROVE") {
        Toast.success("Campaign approved successfully!");
      } else {
        Toast.info("Campaign rejected.");
      }

      return { id, status, remark };
    } catch (error) {
      console.error("Approval request failed:", error);
      Toast.error("Failed to update status");

      return rejectWithValue(error?.response?.data || "Request failed");
    }
  }
);

export const toggleCampaignStatus = createAsyncThunk(
  "campaign/toggleCampaignStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      //  Always send plain boolean wrapped in { status: boolean }
      const responseData = await toggleCampaignStatusAPI(id, { status });

      // Get updated value from backend response (fallback to original status)
      const updatedStatus = responseData?.data?.status ?? status;
      if (status === true) {
        Toast.success("Campaign activated successfully!");
      }

      return { id, status: updatedStatus };
    } catch (error) {
      console.error("Status toggle failed:", error);
      Toast.error(error?.message || "Failed to update status");

      return rejectWithValue(error?.response?.data || "Request failed");
    }
  }
);

// Fetch Campaign Payments history
export const fetchCampaignPayments = createAsyncThunk(
  "campaign/fetchCampaignPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCampaignPaymentHistoryAPI(); // your API
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Fetch Campaign Payments history
export const fetchCampaignRevenueRequest = createAsyncThunk(
  "campaign/fetchCampaignRevenueRequest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCampaignRevenueRequestAPI(); // your API
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const transferRevenue = createAsyncThunk(
  "campaign/transferRevenue",
  async (id, { rejectWithValue }) => {
    try {
      const res = await transferRevenueAPI(id);
      Toast.success("Revenue transferred successfully!");
      return { id };
    } catch (err) {
      Toast.error("Failed to transfer revenue");
      return rejectWithValue(err.response?.data);
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    loading: false,
    error: null,
    data: null, // single campaign (created or updated)
    campaigns: [], // list of campaigns
    fetched: false, // tracks if campaigns have been fetched successfully

    payments: [],
    paymentsFetched: false,
    paymentsLoading: false,

    revenueRequests: [],
    requestFetched: false,
    requestLoading: false,
    transferLoading: false,
    transferError: null,
    transferringId: null,
  },
  reducers: {
    resetCampaigns: (state) => {
      state.campaigns = [];
      state.loading = false;
      state.error = null;
      state.fetched = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        state.fetched = true;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true;
      })

      // optimistic: flip isActive immediately, revert on failure
      .addCase(toggleCampaignStatus.pending, (state, action) => {
        const { id, status } = action.meta.arg;
        const index = state.campaigns.findIndex((c) => c.id === id);
        if (index !== -1) {
          state.campaigns[index].isActive = !status; // flip to new value instantly
        }
      })
      .addCase(toggleCampaignStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.campaigns.findIndex((c) => c.id === id);
        if (index !== -1) {
          state.campaigns[index].isActive = Boolean(status);
        }
      })
      .addCase(toggleCampaignStatus.rejected, (state, action) => {
        // revert back to original value
        const { id, status } = action.meta.arg;
        const index = state.campaigns.findIndex((c) => c.id === id);
        if (index !== -1) {
          state.campaigns[index].isActive = Boolean(status); // restore original
        }
      })

      .addCase(campaignApproval.fulfilled, (state, action) => {
        const { id, status, remark } = action.payload;
        const updatedStatus = status === "APPROVE" ? "APPROVED" : "REJECTED";
        const campaign = state.campaigns.find((c) => c.id === id);
        if (campaign) {
          campaign.isApproved = updatedStatus;
          if (remark) campaign.remark = remark;
        }
      })
      // -------- Fetch Campaign Payments --------
      .addCase(fetchCampaignPayments.pending, (state) => {
        state.paymentsLoading = true;
        state.error = null;
      })

      .addCase(fetchCampaignPayments.fulfilled, (state, action) => {
        state.paymentsLoading = false;
        state.payments = (action.payload || []).map((row, idx) => ({
          ...row,
          id: row.id || row._id || row.transactionId || `row-${idx}`,
        }));
        state.paymentsFetched = true;
      })

      .addCase(fetchCampaignPayments.rejected, (state, action) => {
        state.paymentsLoading = false;
        state.error = action.payload;
        state.paymentsFetched = true;
      })

      // -------- Fetch Campaign Revenue Request --------
      .addCase(fetchCampaignRevenueRequest.pending, (state) => {
        state.requestLoading = true;
        state.error = null;
      })

      .addCase(fetchCampaignRevenueRequest.fulfilled, (state, action) => {
        state.requestLoading = false;

        // action.payload is already the array
        const payload = action.payload || [];

        state.revenueRequests = payload.map((row, idx) => ({
          ...row,
          id: row.id || `row-${idx}`,
        }));

        state.requestFetched = true;
      })

      .addCase(fetchCampaignRevenueRequest.rejected, (state, action) => {
        state.requestLoading = false;
        state.error = action.payload;
        state.requestFetched = true;
      })

      // -------- Fetch Campaign Revenue transfer --------

      .addCase(transferRevenue.pending, (state, action) => {
        state.transferLoading = true;
        state.transferError = null;
        state.transferringId = action.meta.arg;
      })

      .addCase(transferRevenue.fulfilled, (state, action) => {
        state.transferLoading = false;
        state.transferringId = null;
        const { id } = action.payload;

        const idx = state.revenueRequests.findIndex((c) => c.id === id);
        if (idx !== -1) {
          state.revenueRequests[idx].isTransferred = true; // ✅ fix
        }
      })

      .addCase(transferRevenue.rejected, (state, action) => {
        state.transferLoading = false;
        state.transferError = action.payload || "Failed to transfer revenue";
        state.transferringId = null;
      });
  },
});

export const { resetCampaigns } = campaignSlice.actions;
export default campaignSlice.reducer;
