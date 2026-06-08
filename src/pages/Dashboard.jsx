import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import RetailerDashboard from "./user/dashboard/RetailerDashboard";
import AdAgencyDashboard from "./user/dashboard/AdAgencyDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import { fetchCampaigns } from "../redux/slices/user/campaignSlice";
import { useCurrentUser } from "../components/ui/user/CurrentUser";
import Shimmer from "../components/shimmer/Shimmer"
const Dashboard = () => {
  const dispatch = useDispatch();
  const { fetched, loading } = useSelector((state) => state.campaign);

  const user = useCurrentUser();
  const role = user?.role || null;

  useEffect(() => {
    if (["Retailer", "Ad-Agency"].includes(role) && !fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [role, fetched, loading, dispatch]);

  const renderDashboard = () => {
    switch (role) {
      case "Retailer":
        return <RetailerDashboard />;
      case "Ad-Agency":
        return <AdAgencyDashboard />;
      case "ADMIN":
      case "SUPERADMIN":
        return <AdminDashboard />;
      default:
        return <Shimmer/>;
    }
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
};

export default Dashboard;