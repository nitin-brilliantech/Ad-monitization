import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRequests,
  updateRequestStatus,
} from "../../../redux/slices/admin/terminalSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";
import Toast from "../../../components/ui/toast/Toast";
import RemarkModal from "../../../components/ui/modal/RemarkModal";

const DeviceRequest = () => {
  const dispatch = useDispatch();
  const { deviceRequests, loading, formLoading, fetched } = useSelector(
    (state) => state.adminTerminal
  );

  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [rejectionRemark, setRejectionRemark] = useState("");

  useEffect(() => {
    if (!fetched) dispatch(fetchRequests());
  }, [fetched, dispatch]);

  const refreshDevices = () => dispatch(fetchRequests());

  const handleRowClick = (row) => {
    setSelected(row);
    setIsOpen(true);
  };

  const handleStatusUpdate = useCallback(
    async (id, status, remark = "") => {
      try {
        await dispatch(updateRequestStatus({ id, status, remark }));
        Toast.success(status, `Request ${status} Successfully!`);
        refreshDevices();
        setIsOpen(false);
        setSelected(null);
        setIsRemarkOpen(false);
        setRejectionRemark("");
      } catch (error) {
        Toast.error("Failed", "Failed to update the status!");
        console.error(error);
      }
    },
    [dispatch]
  );

  const columns = [
    { id: "name", label: "Device Name" },
    { id: "qty", label: "Quantity" },
    { id: "retailerName", label: "Retailer" },
    { id: "country", label: "Country" },
    { id: "state", label: "State" },
    { id: "city", label: "City" },
    { id: "regions", label: "Regions" },
    { id: "startDate", label: "Request Date" },
    {
      id: "status",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.status} size={12} />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Device Requests</h2>

      <ReusableTable
        columns={columns}
        rows={deviceRequests}
        loading={loading}
        onRowClick={handleRowClick}
        onRefresh={refreshDevices}
        filterKey="status"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        order="desc"
        orderBy="updatedAt"
        searchableColumns={[
          "name",
          "retailerName",
          "country",
          "state",
          "city",
          "regions",
        ]}
      />

      {isOpen && selected && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg" showCloseButton={true}>
          <div className="space-y-6">
            {/* Blue Header */}
            <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-white">Device Request Details</h2>
                <p className="text-md text-white/70 mt-0.5">Review device request information</p>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              {Object.entries(selected).map(([key, value], idx) => (
                <div key={idx}>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {key === "name"
                      ? "Device Name"
                      : key === "qty"
                      ? "Quantity"
                      : key === "retailerName"
                      ? "Retailer"
                      : key === "startDate"
                      ? "Request Date"
                      : key}
                  </label>
                  <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm">
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>

            {selected.status === "PENDING" && (
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsRemarkOpen(true)}
                  disabled={formLoading}
                  className="px-4 py-2 cursor-pointer rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Processing..." : "REJECT"}
                </button>
                <button
                  onClick={() => handleStatusUpdate(selected.id, "APPROVED")}
                  disabled={formLoading}
                  className="px-5 py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Processing..." : "APPROVE"}
                </button>
              </div>
            )}

            <RemarkModal
              label="Reject Request"
              isOpen={isRemarkOpen}
              onClose={() => {
                setIsRemarkOpen(false);
                setRejectionRemark("");
              }}
              remark={rejectionRemark}
              setRemark={setRejectionRemark}
              onSubmit={() =>
                handleStatusUpdate(selected.id, "REJECTED", rejectionRemark)
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeviceRequest;