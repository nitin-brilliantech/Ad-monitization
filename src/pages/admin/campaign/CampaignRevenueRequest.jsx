import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCampaignRevenueRequest,
  transferRevenue,
} from "../../../redux/slices/admin/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import Toast from "../../../components/ui/toast/Toast";
import Modal from "../../../components/modal/Modal";
import Button from "../../../components/ui/button/Button";

const CampaignRevenueRequest = () => {
  const dispatch = useDispatch();
  const {
    revenueRequests,
    requestLoading,
    requestFetched,
    transferLoading
  } = useSelector((state) => state.adminCampaign);

  console.log(revenueRequests)

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch revenue requests on mount
  useEffect(() => {
    if (!requestFetched) {
      dispatch(fetchCampaignRevenueRequest());
    }
  }, [dispatch, requestFetched]);

  const handleRequest = (row) => {
    dispatch(transferRevenue(row.id));
  };

  const columns = [
    { id: "compaignCode", label: "Campaign Code" },
    { id: "campaignName", label: "Campaign Name" },
    { id: "retailerBusinessName", label: "Retailer Name" },
    {
      id: "updatedAt",
      label: "Request Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      id: "amount",
      label: "Amount",
      render: (row) => `₹${Number(row.amount).toLocaleString()}.00`,
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) =>
        row.isTransferred ? (
          <span className="text-gray-500 text-sm">Already Transferred</span>
        ) 
         : (
          <Button
            label="Transfer Revenue"
            onClick={() => handleRequest(row)}
            isIcon={false}
            loading={transferLoading}
          />
        ),
    },
  ];

  const handleRefresh = () => {
    dispatch(fetchCampaignRevenueRequest());
  };


  return (
    <>
      <ReusableTable
        columns={columns}
        rows={revenueRequests || []}
        onRefresh={handleRefresh}
        isFilter={false}
        loading={requestLoading}
        searchableColumns={["campaignName","retailerBusinessName","amount","updatedAt"]}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        {selectedCampaign ? (
          <div className="p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedCampaign.campaignName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Retailer:</span>{" "}
                {selectedCampaign.retailerBusinessName}
              </p>
              <p>
                <span className="font-semibold">Request Date:</span>{" "}
                {new Date(selectedCampaign.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                <span className="text-blue-600 font-bold">
                  ₹{Number(selectedCampaign.amount).toLocaleString()}
                </span>
              </p>
              <p>
                <span className="font-semibold">Transferred:</span>{" "}
                {selectedCampaign.isTransferred ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No campaign selected</p>
        )}
      </Modal>
    </>
  );
};

export default CampaignRevenueRequest;