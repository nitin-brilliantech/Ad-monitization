import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../../components/table/ReusableTable";
import { fetchCampaignPayments } from "../../../redux/slices/admin/campaignSlice"; 
import { Modal } from "../../../components/ui/modal/Modal";
import PaymentStatusBadge from "../../../components/ui/badges/PaymentStatusBadge";

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
      render: (row) => <PaymentStatusBadge status={row.status} size={11} />,
    },
  ];

  const handleRowClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsOpen(true);
  };

  const handleRefresh = () => {
    dispatch(fetchCampaignPayments());
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md" showCloseButton={true}>
        {selectedCampaign ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
              <div className="flex gap-4">
                <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCampaign.campaignName}
                  </h2>
                  <p className="text-md text-white/70 mt-0.5">Campaign Payment Details</p>
                </div>
              </div>
              <PaymentStatusBadge status={selectedCampaign.status} size={11} />
            </div>

            {/* Content */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Campaign Code</span>
                <span className="text-sm text-gray-700">{selectedCampaign.campaignCode}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Agency</span>
                <span className="text-sm text-gray-700">{selectedCampaign.adAgencyBusinessName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Amount</span>
                <span className="text-sm text-gray-900 font-bold">₹{selectedCampaign.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Payment Date</span>
                <span className="text-sm text-gray-700">{new Date(selectedCampaign.paymentDate).toLocaleDateString()}</span>
              </div>
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