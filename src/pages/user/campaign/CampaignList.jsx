import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  fetchCampaigns,
  deleteCampaign,
} from "../../../redux/slices/user/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import EditCampaignModal from "./EditCampaignModal";
import Button from "../../../components/ui/button/Button";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";
import Toast from "../../../components/ui/toast/Toast";
import Title from "antd/es/skeleton/Title";
import LoaderEmpt from "../../../components/loader/LoaderEmpt"

const CampaignList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector(
    (state) => state.campaign
  );
  console.log(campaigns);

  const isViewAnalytics = location.pathname.includes("checkout");

  const filter_camp = campaigns.filter((c) => c.isPayment === false);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch campaigns on mount — always re-fetch to get latest payment status
  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  const handleEdit = (row) => {
    setSelectedCampaign(row);
    setIsEditOpen(true);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Delete Campaign",
      html: `
        <div style="text-align: left;">
          <p style="color: #374151; margin-bottom: 12px;">Are you sure you want to delete this campaign?</p>
          <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px; border-radius: 6px;">
            <p style="color: #991B1B; font-size: 14px; margin: 0;">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
          </div>
        </div>
      `,
      icon: "warning",
      iconColor: "#EF4444",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      cancelButtonColor: "#6B7280",
      confirmButtonColor: "#4684ff",
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        confirmButton: 'px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all',
        cancelButton: 'px-6 py-2.5 rounded-lg font-semibold'
      },
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const campaignId = row.id || row._id || row.campaignCode;
        dispatch(deleteCampaign(campaignId))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "The campaign has been deleted successfully.",
              icon: "success",
              iconColor: "#10B981",
              confirmButtonColor: "#2563EB",
              confirmButtonText: "OK",
              customClass: {
                popup: 'rounded-xl',
                confirmButton: 'px-6 py-2.5 rounded-lg font-semibold'
              }
            });
            refreshCampaigns();
          })
          .catch(() => {
            Swal.fire({
              title: "Error",
              text: "There was a problem deleting the campaign.",
              icon: "error",
              iconColor: "#EF4444",
              confirmButtonColor: "#2563EB",
              confirmButtonText: "OK",
              customClass: {
                popup: 'rounded-xl',
                confirmButton: 'px-6 py-2.5 rounded-lg font-semibold'
              }
            });
          });
      }
    });
  };

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    {
      id: "status",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.isApproved} size={12} />,
    },
    {
  id: "actions",
  label: "Actions",
  render: (row) => {
    const isApproved = row.isApproved;
    const canEdit = isApproved === "PENDING" || isApproved === "REJECTED";

    if (row.isPayment === false && row.isApproved === "APPROVED") {
      return (
        <Link to="checkout" state={{ row }}>
          <Button
            type={"button"}
            label={"Make Payment"}
            isIcon={false}
            className="cursor-pointer"
          />
        </Link>
      );
    }

    return canEdit ? (
      <div className="flex gap-2">
        <button
          className="text-blue-600 bg-blue-200 hover:underline cursor-pointer px-2 py-1 rounded"
          onClick={() => handleEdit(row)}
        >
          Edit
        </button>
        <button
          className="text-red-600 bg-red-200 hover:underline cursor-pointer px-2 py-1 rounded"
          onClick={() => handleDelete(row)}
        >
          Delete
        </button>
      </div>
    ) : null;
  },
}
  ];

  return (
    <>
      {isViewAnalytics ? (
        <Outlet />
      ) : (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Campaigns</h2>

          <ReusableTable
            columns={columns}
            rows={filter_camp}
            loading={loading}
            onRefresh={refreshCampaigns}
            filterKey="isApproved"
            filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
            order="desc"
            orderBy="updatedAt"
            searchableColumns={["name"]}
          />

          {isEditOpen && selectedCampaign && (
            <EditCampaignModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              campaignData={selectedCampaign}
              onSuccess={refreshCampaigns}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CampaignList;
