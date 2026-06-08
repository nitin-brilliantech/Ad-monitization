import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import getColumns from "./Columns";
import { useEffect, useMemo, useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import {
  fetchCampaigns,
  toggleCampaignStatus,
} from "../../../redux/slices/admin/campaignSlice";
import Toast from "../../../components/ui/toast/Toast"

const ActivateCampaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, fetched } = useSelector((state) => state.adminCampaign);
  const [switchLoading, setSwitchLoading] = useState({});

    useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch]);


  const handleActivate = async (id, isActive) => {
    // If campaign is already active, show alert and stop
    if (isActive) {
      return Toast.warning("Already Active","This campaign is already active. You cannot deactivate it.");
    }

    const newStatus = true; // ✅ send boolean now instead of "ACTIVE"
    setSwitchLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await dispatch(toggleCampaignStatus({ id, status: newStatus })).unwrap();
      // dispatch(fetchCampaigns())
    } catch (error) {
      console.error("Toggle failed", error);
    } finally {
      setSwitchLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredCampaigns = useMemo(
  () =>
    campaigns
      .filter((c) => c.isPayment)
      .map((campaign) => {
        let statusLabel;
        if (campaign.isExpired) {
          statusLabel = "EXPIRED";
        } else {
          statusLabel = campaign.isActive ? "ACTIVE" : "INACTIVE";
        }

        return {
          ...campaign,
          statusLabel,
        };
      }),
  [campaigns]
);



  const columns = getColumns(handleActivate, switchLoading);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Live Campaigns</h2>
      </div>
      <ReusableTable
        columns={columns}
        rows={filteredCampaigns}
        loading={loading}
        filterKey="statusLabel"
        filterOptions={["all", "ACTIVE", "INACTIVE","EXPIRED"]}
        onRefresh={() => dispatch(fetchCampaigns())}
        searchableColumns={["campaignCode","name","baseBid","dateRange","brandName"]}
      />
    </div>
  );
};

export default ActivateCampaigns;
