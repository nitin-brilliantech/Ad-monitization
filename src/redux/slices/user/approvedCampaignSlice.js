import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEndedCampaigns, getRetailerCampaigns ,requestRevenue} from '../../../api/user/retailer/retailer-campaign-api';

// Async thunk to fetch approved campaigns
export const fetchApprovedCampaigns = createAsyncThunk(
  'approvedCampaigns/fetchApprovedCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRetailerCampaigns();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch approved campaigns');
    }
  }
);

// Async thunk to fetch ended campaigns
export const fetchEndedCampaigns = createAsyncThunk(
  'approvedCampaigns/fetchEndedCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEndedCampaigns();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch approved campaigns');
    }
  }
);



export const raiseRevenueRequest = createAsyncThunk(
  'approvedCampaigns/raiseRevenueRequest',
  async (campaignId, { rejectWithValue }) => {
    try {
      const response = await requestRevenue(campaignId);
      return { campaignId, data: response }; // return campaignId to update state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to raise revenue request');
    }
  }
);
const approvedCampaignSlice = createSlice({
  name: 'approvedCampaigns',
  initialState: {
    campaigns: [],
    loading: false,
    error: null,
    fetched: false,
     endedCampaigns: [],
    endedLoading: false,
   endedError: null,
    endedFetched: false,

  },
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload || [];
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
      state.fetched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        state.fetched = true;
      })
      .addCase(fetchApprovedCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.fetched = true;
      })
      /// expired ended campaigns
      .addCase(fetchEndedCampaigns.pending, (state) => {
        state.endedLoading = true;
        state.endedError = null;
      })
      .addCase(fetchEndedCampaigns.fulfilled, (state, action) => {
        state.endedLoading = false;
        state.endedCampaigns = action.payload;
        state.endedFetched = true;
      })
      .addCase(fetchEndedCampaigns.rejected, (state, action) => {
        state.endedLoading = false;
        state.endedError = action.payload;
        state.endedFetched = true;
      })

      .addCase(raiseRevenueRequest.pending, (state) => {
      state.endedLoading = true; // optionally, show loading
      state.endedError = null;
    })
    .addCase(raiseRevenueRequest.fulfilled, (state, action) => {
      state.endedLoading = false;
      const { campaignId } = action.payload;
      state.endedCampaigns = state.endedCampaigns.map(c =>
        c.id === campaignId ? { ...c, isRequested: true } : c
      );
    })
    .addCase(raiseRevenueRequest.rejected, (state, action) => {
      state.endedLoading = false;
      state.endedError = action.payload;
    });
  },
});

export const { setCampaigns, clearCampaigns } = approvedCampaignSlice.actions;
export default approvedCampaignSlice.reducer;