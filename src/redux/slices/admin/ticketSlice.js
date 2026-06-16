import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  // createTicketAPI,
  getAllTicketAPI,
  updateStatusTicketAPI,
} from "../../../api/admin/ticket/ticket-api"

// // Thunks
// export const createTicket = createAsyncThunk(
//   "tickets/create",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await createTicketAPI(data);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

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

// Slice
const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    loading: false,
    formLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Create ticket
    // builder
    //   .addCase(createTicket.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(createTicket.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.success = "Ticket created successfully";
    //     if (!state.tickets) state.tickets = [];
    //     state.tickets.push(action.payload);
    //   })
    //   .addCase(createTicket.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });

    // Fetch tickets
    builder
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload || [];
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update ticket status (form loading)
    builder
      .addCase(updateTicketStatus.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.formLoading = false;
        state.success = "Ticket updated successfully";

        if (Array.isArray(state.tickets)) {
          const index = state.tickets.findIndex(
            (ticket) => ticket.id === action.payload.id
          );
          if (index !== -1) {
            state.tickets[index] = action.payload;
          }
        }
      })

      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatus } = ticketSlice.actions;
export default ticketSlice.reducer;