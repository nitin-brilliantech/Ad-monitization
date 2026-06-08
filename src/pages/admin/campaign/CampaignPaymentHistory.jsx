import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../../components/table/ReusableTable";
// import Modal from "../../../components/modal/Modal";
import { fetchCampaignPayments } from "../../../redux/slices/admin/campaignSlice"; 
import { Modal } from "../../../components/ui/modal/Modal";

const CampaignPaymentHistory = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const { payments, paymentsLoading, paymentsFetched } = useSelector(
    (state) => state.campaign
  );

  // Fetch on mount
  useEffect(() => {
    if (!paymentsFetched) {
      dispatch(fetchCampaignPayments());
    }
  }, [dispatch, paymentsFetched]);

  const columns = [
    { id: "campaignCode", label: "Campaign Code" },
    { id: "campaignName", label: "Campaign Name" },
    { id: "adAgencyBusinessName", label: "Agency Business Name" },
    {
      id: "amount",
      label: "Amount",
      render: (row) => <div>₹{row.amount}.00</div>,
    },
    {
      id: "paymentDate",
      label: "Payment Date",
      render: (row) => new Date(row.paymentDate).toLocaleDateString(),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <span className={getStatusBadge(row.status)}>
          {row.status}
        </span>
      ),
    },
  ];

  const handleRowClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsOpen(true);
  };

  const handleRefresh = () => {
    dispatch(fetchCampaignPayments());
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 text-xs font-semibold rounded-full w-fit ";
    switch (status) {
      case "Paid":
        return baseClass + "bg-green-100 text-green-700";
      case "Pending":
        return baseClass + "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return baseClass + "bg-red-100 text-red-700";
      default:
        return baseClass + "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
        <ReusableTable
          columns={columns}
          rows={payments}
          onRowClick={handleRowClick}
          loading={paymentsLoading}
          filterKey="status"
          filterOptions={["all", "PAID", "UNPAID"]}
          onRefresh={handleRefresh}
          searchableColumns={[
            "campaignCode",
            "campaignName",
            "adAgencyBusinessName",
            "amount",
          ]}
        />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md" title="Campaign Payment Details">
        {selectedCampaign ? (
          <div className="p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedCampaign.campaignName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Code:</span>{" "}
                {selectedCampaign.campaignCode}
              </p>
              <p>
                <span className="font-semibold">Agency:</span>{" "}
                {selectedCampaign.adAgencyBusinessName}
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                <span className="text-blue-600 font-bold">
                  ₹{selectedCampaign.amount?.toLocaleString()}
                </span>
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selectedCampaign.paymentDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className={getStatusBadge(selectedCampaign.status)}>
                  {selectedCampaign.status}
                </span>
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

export default CampaignPaymentHistory;