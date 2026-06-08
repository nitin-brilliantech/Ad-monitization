import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampaigns,
  campaignApproval,
} from "../../../redux/slices/admin/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import CampaignDetailsModal from "./CampaignDetailsModal";
import RejectCampaignModal from "./RejectCampaignModal";
import getCampaignColumns from "./columns";

const CampaignRequest = () => {
  const dispatch = useDispatch();
  const { campaigns, loading,fetched } = useSelector((state) => state.adminCampaign);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState("");



    useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch]);

  const handleRowClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsOpen(true);
  };

  const handleApproval = (status, remark = "") => {
    if (!selectedCampaign) return;


    const payload = {
      id: selectedCampaign.id,
      status: status === "REJECTED" ? "REJECT" : "APPROVE",
      remark: status === "REJECTED" ? remark : undefined,
    };

    // Close modals immediately
    setIsOpen(false);
    setIsRejectModalOpen(false);
    setRejectionRemark("");

    // Trigger Redux async thunk (state updates immediately via reducer)
    dispatch(campaignApproval(payload));
  };

  const openRejectModal = () => {
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectionRemark("");
  };


const handleReferesh=()=>{
    dispatch(fetchCampaigns())
  }
  
  const columns = getCampaignColumns();

 
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaign Requests</h2>
      </div>

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          rows={campaigns}
          onRowClick={handleRowClick}
          
          filterKey="isApproved"
          filterOptions={["all","APPROVED","PENDING","REJECTED"]}
          onRefresh={handleReferesh}
          loading={loading}
          searchableColumns={["campaignCode","name","brandName","baseBid","schedule","adType"]}
        
        />
      </div>

      {/* Campaign Details Modal */}
      <CampaignDetailsModal
        isOpen={isOpen}
        openRejectModal={openRejectModal}
        onClose={() => setIsOpen(false)}
        campaign={selectedCampaign}
        onApprove={() => handleApproval("APPROVE")}
        onReject={() => setIsRejectModalOpen(true)}
      />

      {/* Reject Modal */}
      <RejectCampaignModal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        remark={rejectionRemark}
        setRemark={setRejectionRemark}
        onSubmit={() => handleApproval("REJECTED", rejectionRemark)}
      />
    </div>
  );
};

export default CampaignRequest;
