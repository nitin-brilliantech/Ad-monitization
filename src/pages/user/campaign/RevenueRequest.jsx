import React, { useEffect } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import Toast from "../../../components/ui/toast/Toast";
import Modal from "../../../components/modal/Modal";
import Button from "../../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEndedCampaigns,
  raiseRevenueRequest,
} from "../../../redux/slices/user/approvedCampaignSlice";
import Loader from "../../../components/loader/Loader";
const RevenueRequest = () => {
  const dispatch = useDispatch();
  const { endedCampaigns, endedLoading, endedFetched } = useSelector(
    (state) => state.approvedCampaigns
  );

  useEffect(() => {
    if (!endedFetched && !endedLoading) {
      dispatch(fetchEndedCampaigns());
    }
  }, [dispatch, endedFetched, endedLoading]);


  const handleRequest = (row) => {
    dispatch(raiseRevenueRequest(row.id))
      .unwrap()
      .then(() => {
        Toast.success("Request sent successfully!");
      })
      .catch((err) => {
        Toast.error(err || "Failed to send request");
      });
  };

  const columns = [
    {
      id: "compaignCode",
      label: "Campaign Code",
      render: (row) => row.compaignCode || "N/A",
    },
    {
      id: "campaignName",
      label: "Campaign Name",
      render: (row) => row.campaignName || "N/A",
    },
    {
      id: "startDate",
      label: "Start Date",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) =>
        row.isTransfered ? (
          <span className="text-gray-500 text-sm">
            Revenue already transferred
          </span>
        ) : row.isRequested ? (
          <span className="text-gray-500 text-sm">Request already sent</span>
        ) : endedLoading ? (
          <Loader size="vs" />
        ) : (
          <Button
            label="Request"
            onClick={() => handleRequest(row)}
            isIcon={false}
          />
        ),
    },
  ];

  const handleRefresh = () => {
    dispatch(fetchEndedCampaigns());
  };

  return (
    <>
      <ReusableTable
        columns={columns}
        rows={endedCampaigns}
        loading={endedLoading}
        onRefresh={handleRefresh}
        searchableColumns={["campaignCode", "campaignName","startDate","endDate"]}
      />
    </>
  );
};

export default RevenueRequest;
