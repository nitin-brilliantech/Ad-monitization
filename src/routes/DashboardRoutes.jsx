import { lazy } from "react";
import { Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import PrivateRoute from "./PrivateRoute";

// ================= USER ROUTES =================
const Dashboard = lazy(() => import("../pages/Dashboard"));
const CreateCampaign = lazy(() => import("../pages/user/campaign/CreateCampaign"));
const CampaignList = lazy(() => import("../pages/user/campaign/CampaignList"));
const CampaignReports = lazy(() => import("../pages/user/campaign/CampaignReports"));
const BidManagement = lazy(() => import("../pages/user/campaign/BidManagement"));
const UserDetails = lazy(() => import("../pages/shared/UserDetails"));
const Devices = lazy(() => import("../pages/user/retailer/Devices"));
const AdPerformance = lazy(() => import("../pages/user/retailer/AdPerformance"));
const WithdrawEarning = lazy(() => import("../pages/user/retailer/WithdrawEarning"));
const ProductAnalytics = lazy(() => import("../pages/user/retailer/ProductAnalytics"));
const DataPrivacy = lazy(() => import("../pages/user/retailer/DataPrivacy"));
const ActiveCampaigns = lazy(() => import("../pages/user/campaign/ActiveCampaigns"));
const CheckoutCampaign = lazy(() => import("../pages/user/campaign/CheckoutCampaign"));
const Campaigns = lazy(() => import("../pages/user/retailer/Campaigns"));
const Wallets = lazy(() => import("../pages/user/retailer/Wallet"));
const Reports = lazy(() => import("../pages/user/retailer/Reports"));
const Settings = lazy(() => import("../pages/user/retailer/Settings"));
const Support = lazy(() => import("../pages/user/retailer/Support"));
const TicketRaise = lazy(() => import("../pages/user/Ticket/TicketRaise"));
const RevenueRequest = lazy(() => import("../pages/user/campaign/RevenueRequest"));
const PaymentsHistory = lazy(() => import("../pages/user/campaign/PaymentsHistory"));

// ================= ADMIN ROUTES =================
const UserManagement = lazy(() => import("../pages/admin/userManagement/UserManagement"));
const CampaignRequest = lazy(() => import("../pages/admin/campaign/CampaignRequest"));
const BidReview = lazy(() => import("../pages/admin/bidsReview/BidReview"));
const RevenuePayouts = lazy(() => import("../pages/admin/revenuePayouts/RevenuePayouts"));
const Setting = lazy(() => import("../pages/admin/setting/Setting"));
const ConfigurationManagement = lazy(() => import("../pages/admin/configManagement/ConfigurationManagement"));
const ActivateCampaigns = lazy(() => import("../pages/admin/liveCampaings/ActivateCampaigns"));
const TicketSystem = lazy(() => import("../pages/admin/TicketSystem/TicketSystem"));
const AdminMyEarnings = lazy(() => import("../pages/admin/earn/MyEarnigs"));
const PayoutCheckout = lazy(() => import("../pages/admin/revenuePayouts/PayoutCheckout"));
const WithdrawalRequest = lazy(() => import("../pages/admin/revenuePayouts/WithdrawalRequest"));
const CampaignPaymentHistory = lazy(() => import("../pages/admin/campaign/CampaignPaymentHistory"));
const CampaignRevenueRequest = lazy(() => import("../pages/admin/campaign/CampaignRevenueRequest"));

export const dashboardRoutes = [

    <Route
    key="layout"
    element={
      <PrivateRoute allowedRoles={["Retailer", "Ad-Agency", "SUPERADMIN","ADMIN"]}>
        <AppLayout />
      </PrivateRoute>
    }
  >

    {/* Shared route */}
    <Route path="/" element={<Dashboard />} />

    <Route
      path="/create-campaign"
      element={
        <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CreateCampaign />
        </PrivateRoute>
      }
    />
    <Route path="/campaigns-list" element={
      <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CampaignList />
        </PrivateRoute>}>
      <Route path="checkout" element={<CheckoutCampaign />} />
    </Route>
    <Route path="/reports" element={
      <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <CampaignReports />
        </PrivateRoute>} />
    <Route path="/bids" element={<PrivateRoute allowedRoles={["Ad-Agency"]}>
          <BidManagement />
        </PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute allowedRoles={["Retailer", "Ad-Agency","SUPERADMIN","ADMIN"]}>
          <UserDetails />
        </PrivateRoute>} />
        <Route path="/active-ads" element={ <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <ActiveCampaigns />
        </PrivateRoute>} />
        
         <Route path="/payment-history" element={ <PrivateRoute allowedRoles={["Ad-Agency"]}>
          <PaymentsHistory />
        </PrivateRoute>} />

        {/* Retailer routes */}
      <Route path="/devices" element={<PrivateRoute allowedRoles={["Retailer"]}>
          <Devices />
        </PrivateRoute>} />

    <Route path="/ad-performance" element={<PrivateRoute allowedRoles={["Retailer"]}>
          <AdPerformance />
        </PrivateRoute>}>
      <Route path="view-analytics" element={<ProductAnalytics />} />
    </Route>
    <Route path="/withdraw-earning" element={<PrivateRoute allowedRoles={["Retailer"]}>
          <WithdrawEarning />
        </PrivateRoute>} />
       <Route path="/data-privacy" element={ <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
          <DataPrivacy />
        </PrivateRoute>} />
      
        <Route path="/campaigns" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <Campaigns />
        </PrivateRoute>} />
        <Route path="/wallet" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <Wallets />
        </PrivateRoute>} />

         <Route path="/revenue-request" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <RevenueRequest />
        </PrivateRoute>} />
        
        <Route path="/report" element={ <PrivateRoute allowedRoles={["Retailer"]}>
          <Reports />
        </PrivateRoute>} />
        
        <Route path="/support" element={<PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
          <Support />
        </PrivateRoute>}>
      <Route path="raise-ticket" element={<TicketRaise />} />
    </Route>
        
        <Route path="/settings" element={ <PrivateRoute allowedRoles={["Retailer", "Ad-Agency"]}>
          <Settings />
        </PrivateRoute>} />

    {/* ADMIN ROUTES */}
      <Route 
        path="user-management" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <UserManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="campaign-request" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <CampaignRequest />
          </PrivateRoute>
        } 
      />
       <Route 
        path="campaign-payment-history" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <CampaignPaymentHistory />
          </PrivateRoute>
        } 
      />
      <Route 
        path="live-campaigns" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <ActivateCampaigns />
          </PrivateRoute>
        } 
      />
      <Route 
        path="manage-bids" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <BidReview />
          </PrivateRoute>
        } 
      />
      <Route 
        path="campaign-revenue-request" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <CampaignRevenueRequest />
          </PrivateRoute>
        } 
      />
      <Route 
        path="request-withdrawal" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <WithdrawalRequest />
          </PrivateRoute>
        } 
      />
      <Route 
        path="revenue-payouts" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <RevenuePayouts />
          </PrivateRoute>
        } 
      >
        <Route 
          path="pay" 
          element={
            <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
              <PayoutCheckout />
            </PrivateRoute>
          } 
        />
      </Route>
      <Route 
        path="config-management" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <ConfigurationManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="setting" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <Setting />
          </PrivateRoute>
        } 
      />
    
      <Route 
        path="ticket" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <TicketSystem />
          </PrivateRoute>
        } 
      />
      <Route 
        path="earning" 
        element={
          <PrivateRoute allowedRoles={["SUPERADMIN","ADMIN"]}>
            <AdminMyEarnings />
          </PrivateRoute>
        } 
      />

  </Route>,
];