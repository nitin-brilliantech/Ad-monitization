import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Toast from "../../../components/ui/toast/Toast";
import {
  createCampaignAPI,
  getCampaignsAPI,
  updateUserCampaign,
  deleteCampaignAPI,
  getCampaignsPaymentHistoryAPI,
} from "../../../api/user/campaign-api/campaignService";

// ===================== Thunks =====================

// Create Campaign
export const createCampaign = createAsyncThunk(
  "campaign/createCampaign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createCampaignAPI(data);
      Toast.success("Campaign created successfully!");
      return response;
    } catch (error) {
      Toast.error(
        error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "An error occurred while creating the campaign."
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

// Fetch Campaigns
export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCampaignsAPI();
      return response.data;
    } catch (error) {
      Toast.error("Failed to fetch campaigns.");
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update Campaign
export const updateCampaign = createAsyncThunk(
  "campaign/updateCampaign",
  async ({ id, data, oldImages = [], oldVideos = [] }, { rejectWithValue }) => {
    try {
      const response = await updateUserCampaign(id, data, oldImages, oldVideos);
      Toast.success("Campaign updated successfully!");
      return response;
    } catch (err) {
      Toast.error(err.response?.data?.message || "Failed to update campaign");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete Campaign
export const deleteCampaign = createAsyncThunk(
  "campaign/deleteCampaign",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCampaignAPI(id);
      Toast.success("Campaign deleted successfully!");
      return id;
    } catch (err) {
      Toast.error(err.response?.data?.message || "Failed to delete campaign");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Fetch Campaign Payments
export const fetchCampaignPayments = createAsyncThunk(
  "campaign/fetchCampaignPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCampaignsPaymentHistoryAPI(); // your API
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ===================== Slice =====================

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    loading: false, // For global fetch/list operations
    formLoading: false, // For create/update form operations
    error: null,
    data: null,
    campaigns: [],
    fetched: false,
    payments: [],
    paymentsFetched: false,
    paymentsLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // -------- Create Campaign --------
      .addCase(createCampaign.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.formLoading = false;
        state.data = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // -------- Fetch Campaigns --------
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

      // -------- Update Campaign --------
      .addCase(updateCampaign.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.formLoading = false;
        state.data = action.payload;
        const updated = action.payload;
        const index = state.campaigns.findIndex(
          (c) => c._id === updated._id || c.id === updated.id
        );
        if (index !== -1) {
          state.campaigns[index] = updated;
        }
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      })

      // -------- Delete Campaign --------
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = state.campaigns.filter((campaign) => {
          const campaignId = campaign._id || campaign.id || campaign.campaignId;
          return campaignId !== action.payload;
        });
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
      });
  },
});

export default campaignSlice.reducer;
