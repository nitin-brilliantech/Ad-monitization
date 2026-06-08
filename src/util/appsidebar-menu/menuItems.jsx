import { GridIcon, 
  ReportIcon, 
  BidIcon, 
  CampaignIcon, 
  WithdrawIcon, 
  PrivacyIcon, 
  SettingIcon, 
  AnalyticIcon, 
  DeviceIcon, 
  SupportIcon, CampaignReqIcon, UserMgntIcon, BidReviewIcon, RevenuePayIcon, DeviceMgntIcon
} 
from "../../icon/index"

export const menuItems = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  { name: "Campaigns", icon: <CampaignIcon />, path: "/campaigns-list" },
  { name: "Active Campaigns", icon: <BidIcon />, path: "/active-ads" },
  { name: "Payments History", icon: <RevenuePayIcon />, path: "/payment-history" },
  { name: "Reports", icon: <ReportIcon />, path: "/reports" },
  { name: "Bid Management", icon: <BidIcon />, path: "/bids" },
  { name: "Settings", icon: <SettingIcon />, path: "/settings" },
  { name: "Support", icon: <SupportIcon />, path: "/support" },
  { name: "Data Privacy", icon: <PrivacyIcon />, path: "/data-privacy" },
];


export const retailerMenuItems = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  //{ name: "POS Data Upload", icon: <CampaignIcon />, path: "/pos-upload" },
  { name: "Ad Performance", icon: <AnalyticIcon />, path: "/ad-performance" },
  { name: "Devices", icon: <DeviceIcon />, path: "/devices" },
  //{name: "Campaigns", icon:<WithdrawIcon />, path:"/campaigns"},
  { name: "Campaign Revenue Request", icon: <RevenuePayIcon />, path: "/revenue-request" },
  { name: "Wallet", icon: <WithdrawIcon />, path: "/wallet" },
  { name: "Reports", icon: <ReportIcon />, path: "/report" },
  //{name: "Withdraw Earning", icon: <WithdrawIcon/>, path:"/withdraw-earning"},
  { name: "Settings", icon: <SettingIcon />, path: "/settings" },
  { name: "Support", icon: <SupportIcon />, path: "/support" },
  { name: "Data Privacy", icon: <PrivacyIcon />, path: "/data-privacy" },



];

export const adminMenuItems = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  { name: "User Management", icon: <UserMgntIcon />, path: "/user-management" },
  {
    name: "Configuration Management",
    icon: <DeviceMgntIcon />,
    path: "/config-management",
  },
  {
    name: "Campaign Request",
    icon: <CampaignReqIcon />,
    path: "/campaign-request",
  },
  {
    name: "Campaign Payment History",
    icon: <CampaignReqIcon />,
    path: "/campaign-payment-history",
  },
  {
    name: "Live Campaigns",
    icon: <CampaignReqIcon />,
    path: "/live-campaigns",
  },
  {
    name: "My Earning",
    icon: <RevenuePayIcon />,
    path: "/earning",
  },
  {
    name: "Campaign Revenue Request",
    icon: <CampaignReqIcon />,
    path: "/campaign-revenue-request",
  },
  {
    name: "Withdrawal Request",
    icon: <CampaignReqIcon />,
    path: "/request-withdrawal",
  },
  {
    name: "Revenue & Payouts",
    icon: <RevenuePayIcon />,
    path: "/revenue-payouts",
  },
  { name: "Bid Review", icon: <BidReviewIcon />, path: "/manage-bids" },
  {
    name: "Ticket System",
    icon: <DeviceMgntIcon />,
    path: "/ticket",
  },
  { name: "Setting", icon: <SettingIcon />, path: "/setting" },
  
];
