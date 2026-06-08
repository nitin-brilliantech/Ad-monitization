// src/store/slices/ticketsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTicketAPI } from "../../../api/user/tickets-api/ticket-api";

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
      });
  },
});

export default ticketsSlice.reducer;


// // src/store/slices/ticketsSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createTicketAPI } from "../../api/tickets-api/ticketApi"; 

// // ✅ Add a new ticket (only function kept active)
// export const addTicket = createAsyncThunk(
//   "tickets/addTicket",
//   async (ticketData, { rejectWithValue }) => {
//     try {
//       const res = await createTicketAPI(ticketData);
//       return res; // API returns the created ticket
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const ticketsSlice = createSlice({
//   name: "tickets",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // --- ADD ---
//       .addCase(addTicket.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addTicket.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list.push(action.payload);
//       })
//       .addCase(addTicket.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to add ticket";
//       });
//   },
// });

// export default ticketsSlice.reducer;
