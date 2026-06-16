import {
  LayoutDashboard, Megaphone, PlayCircle, CreditCard, BarChart2,
  Gavel, Settings, HeadphonesIcon, ShieldCheck, TrendingUp, Monitor,
  Wallet, Users, SlidersHorizontal, FileCheck, DollarSign, Radio,
  ArrowDownToLine, Ticket, Scale
} from "lucide-react";

export const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Campaigns", icon: Megaphone, path: "/campaigns-list" },
  { name: "Active Campaigns", icon: PlayCircle, path: "/active-ads" },
  { name: "Payments History", icon: CreditCard, path: "/payment-history" },
  { name: "Reports", icon: BarChart2, path: "/reports" },
  { name: "Bid Management", icon: Gavel, path: "/bids" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Support", icon: HeadphonesIcon, path: "/support" },
  { name: "Data Privacy", icon: ShieldCheck, path: "/data-privacy" },
];

export const retailerMenuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  //{ name: "POS Data Upload", icon: Upload, path: "/pos-upload" },
  { name: "Ad Performance", icon: TrendingUp, path: "/ad-performance" },
  { name: "Devices", icon: Monitor, path: "/devices" },
  //{name: "Campaigns", icon: Megaphone, path:"/campaigns"},
  { name: "Campaign Revenue Request", icon: DollarSign, path: "/revenue-request" },
  { name: "Wallet", icon: Wallet, path: "/wallet" },
  { name: "Reports", icon: BarChart2, path: "/report" },
  //{name: "Withdraw Earning", icon: ArrowDownToLine, path:"/withdraw-earning"},
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Support", icon: HeadphonesIcon, path: "/support" },
  { name: "Data Privacy", icon: ShieldCheck, path: "/data-privacy" },
];

export const adminMenuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "User Management", icon: Users, path: "/user-management" },
  { name: "Configuration Management", icon: SlidersHorizontal, path: "/config-management" },
  { name: "Campaign Request", icon: FileCheck, path: "/campaign-request" },
  { name: "Campaign Payment History", icon: CreditCard, path: "/campaign-payment-history" },
  { name: "Live Campaigns", icon: Radio, path: "/live-campaigns" },
  { name: "My Earning", icon: DollarSign, path: "/earning" },
  { name: "Campaign Revenue Request", icon: Megaphone, path: "/campaign-revenue-request" },
  { name: "Withdrawal Request", icon: ArrowDownToLine, path: "/request-withdrawal" },
  { name: "Revenue & Payouts", icon: Wallet, path: "/revenue-payouts" },
  { name: "Bid Review", icon: Scale, path: "/manage-bids" },
  {name: "Terminals", icon: Ticket, path: "/terminals"},
  { name: "Ticket System", icon: Ticket, path: "/ticket" },
  { name: "Setting", icon: Settings, path: "/setting" },
];
