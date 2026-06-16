import { useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";
import Swal from "sweetalert2";
import Toast from "../../../components/ui/toast/Toast";
import EditCampaignModal from "./EditCampaignModal";
import { deleteCampaign,fetchCampaigns } from "../../../redux/slices/user/campaignSlice";

const DraftCampaign = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const filter_camp = campaigns.filter((c) => c.isDraft === true);
  console.log("Draft Campaigns:", filter_camp);

  const handleEdit = (row) => {
    setSelectedCampaign(row);
    setIsEditOpen(true);
  };

    const refreshCampaigns = () => {
      dispatch(fetchCampaigns());
    };
  const handleDelete = (row) => {
    Swal.fire({
      title: "Delete Draft Campaign",
      html: `
        <div style="text-align: left;">
          <p style="color: #374151; margin-bottom: 12px;">Are you sure you want to delete this draft campaign?</p>
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
      confirmButtonColor: "#2563EB",
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
              text: "The draft campaign has been deleted successfully.",
              icon: "success",
              iconColor: "#10B981",
              confirmButtonColor: "#2563EB",
              confirmButtonText: "OK",
              customClass: {
                popup: 'rounded-xl',
                confirmButton: 'px-6 py-2.5 rounded-lg font-semibold'
              }
            });
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
      id: "actions",
      label: "Actions",
      render: (row) => {
        return row.isDraft ? (
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
    },
  ];

  return (
    <div>
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">
        Campaign Drafts
      </h2>

      <ReusableTable
        columns={columns}
        rows={filter_camp}
        loading={loading}
        onRefresh={"refreshCampaigns"}
        filterKey="isApproved"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        order="desc"
        orderBy="updatedAt"
      />

      {isEditOpen && selectedCampaign && (
        <EditCampaignModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          campaignData={selectedCampaign}
          onSuccess={refreshCampaigns }
          isScond={true}
          seconLabel="Update Draft"
          btnLabel="Submit for Approval"
        />
      )}
    </div>
  );
};

export default DraftCampaign;
