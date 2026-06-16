import { configureStore } from '@reduxjs/toolkit'

// User Slices
import campaignReducer from './slices/user/campaignSlice'
import userReducer from './slices/user/userSlice'
import approvedCampaignReducer from './slices/user/approvedCampaignSlice'
import ticketsReducer from './slices/user/ticketsSlice'
import cityProductDeviceReducer from './slices/user/cityProductDeviceSlice'
import walletReducer from './slices/user/walletSlice'

// Admin Slices
import adminCampaignReducer from './slices/admin/campaignSlice'
import adminReducer from './slices/admin/adminSlice'
import usersManagementReducer from './slices/admin/userManagementSlice'
import deviceReducer from './slices/admin/deviceSlice'
import tierReducer from './slices/admin/tierSlice'
import productReducer from './slices/admin/productSlice'
import payoutReducer from './slices/admin/payoutSlice'
import adminRevenueReducer from './slices/admin/adminRevenueSlice'
import terminalReducer from './slices/admin/terminalSlice'

export const store = configureStore({
  reducer: {
    // User Slices
    campaign: campaignReducer,
    user: userReducer,
    approvedCampaigns: approvedCampaignReducer,
    tickets: ticketsReducer,
    cityProductDevice: cityProductDeviceReducer,
    wallet: walletReducer,

    // Admin Slices
    adminCampaign: adminCampaignReducer,
    admin: adminReducer,
    adminRevenue:adminRevenueReducer,
    usersManagement: usersManagementReducer,
    device: deviceReducer,
    tier: tierReducer,
    product: productReducer,
    payout: payoutReducer,
    adminTerminal: terminalReducer,
  },
})