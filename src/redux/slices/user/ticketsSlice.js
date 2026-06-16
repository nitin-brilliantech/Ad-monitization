// src/store/slices/ticketsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTicketAPI,
  getAllTicketAPI,
  updateStatusTicketAPI,
} from "../../../api/user/tickets-api/ticket-api";

export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const res = await createTicketAPI(ticketData);
      return res; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllTickets = createAsyncThunk(
  "tickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllTicketAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "tickets/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateStatusTicketAPI(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add ticket
      .addCase(addTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add ticket";
      })
      // Fetch all tickets
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ticket status
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.list)) {
          const index = state.list.findIndex(
            (ticket) => ticket.id === action.payload.id
          );
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketsSlice.reducer;
