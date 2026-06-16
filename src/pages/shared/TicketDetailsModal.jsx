import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../../components/ui/modal/Modal";
import MediaCarousels from "../../components/ui/carousel/MediaCarousels";
import RemarkModal from "../../components/ui/modal/RemarkModal";
import Button from "../../components/ui/button/Button";
import LoaderEmpt from "../../components/loader/LoaderEmpt";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  role = "user",
  onSubmit,
  formLoading = false,
}) => {
  const [userRemark, setUserRemark] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [remarkError, setRemarkError] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);

  // Reset state when ticket changes
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "ACTIVE");
      setUserRemark("");
      setRemarkError(false);
      setShowRemarkModal(false);
    }
  }, [ticket]);

  const {
    ticketCode = "",
    queryType = "No Subject",
    description = "No additional details provided",
    media = [],
    status: currentStatus = "ACTIVE",
    createdAt,
  } = ticket || {};

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "";

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" },
      RESOLVED: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
      CLOSED: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    };
    return colors[status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-100" };
  };

  const mediaFiles = useMemo(
    () => ({
      images: media.filter((url) => !url.match(/\.(mp4|webm|ogg)$/i)),
      videos: media.filter((url) => url.match(/\.(mp4|webm|ogg)$/i)),
    }),
    [media]
  );

  const statusOptions = useMemo(() => {
    const adminOptions = ["ACTIVE", "RESOLVED", "CLOSED"];
    if (role === "admin") {
      return adminOptions.filter((s) => s !== status).concat(status); // keep current status on top
    } else {
      return status === "ACTIVE" ? ["ACTIVE", "CLOSED"] : [status];
    }
  }, [role, status]);

  const handleStatusChange = (e) => {
    const selected = e.target.value;
    setStatus(selected);

    const requiresRemark =
      (role === "admin" && (selected === "RESOLVED" || selected === "CLOSED")) ||
      (role !== "admin" && selected === "CLOSED");

    setShowRemarkModal(requiresRemark);
  };

  const handleSubmit = () => {
    const requiresRemark =
      (role === "admin" && (status === "RESOLVED" || status === "CLOSED")) ||
      (role !== "admin" && status === "CLOSED");

    if (requiresRemark && !userRemark.trim()) {
      setRemarkError(true);
      setShowRemarkModal(true);
      return;
    }

    onSubmit?.({ status, remark: userRemark.trim() });
    setShowRemarkModal(false);
  };

  if (!ticket) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
        {formLoading && <LoaderEmpt />}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{queryType}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-blue-100 text-sm">Ticket: {ticketCode}</span>
                  <span className="text-blue-100 text-sm">•</span>
                  <span className="text-blue-100 text-sm">{formatDate(createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(currentStatus).bg} ${getStatusColor(currentStatus).text} border-2 ${getStatusColor(currentStatus).border}`}
                >
                  {currentStatus}
                </span>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
                  disabled={formLoading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Description */}
            <InfoBox label="Description" value={description} />

            {/* Remark if exists */}
            {ticket?.remark && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="text-sm font-semibold text-red-700">Remark</label>
                <div className="mt-2 text-sm text-red-600">
                  {ticket.remark}
                </div>
              </div>
            )}

            {/* Media */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Attached Media</label>
              {mediaFiles.images.length + mediaFiles.videos.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <MediaCarousels mediaFiles={mediaFiles} size="xs" />
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm">No media attached</p>
                </div>
              )}
            </div>

            {/* Status Update */}
            {statusOptions.length > 0 && (
              <StatusUpdateSection
                role={role}
                status={status}
                statusOptions={statusOptions}
                onStatusChange={handleStatusChange}
                onSubmit={handleSubmit}
                formLoading={formLoading}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Remark Modal */}
      <RemarkModal
        label="Remark"
        placeholder="Reason for status change"
        isOpen={showRemarkModal}
        onClose={() => setShowRemarkModal(false)}
        remark={userRemark}
        setRemark={setUserRemark}
        error={remarkError}
        onSubmit={() => {
          setRemarkError(false);
          handleSubmit();
        }}
      />
    </>
  );
};

// --- Reusable InfoBox ---
const InfoBox = ({ label, value, textColor = "text-gray-800" }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 mb-2 block">{label}</label>
    <div className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm ${textColor}`}>
      {value || "—"}
    </div>
  </div>
);

// --- Reusable Status Update Section ---
const StatusUpdateSection = ({ role, status, statusOptions, onStatusChange, onSubmit, formLoading }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-4">
    <div className="flex items-center gap-2 mb-3">
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <label className="text-sm font-bold text-blue-900">Update Ticket Status</label>
    </div>
    <div>
      <select
        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-gray-700"
        value={status}
        onChange={onStatusChange}
        disabled={formLoading}
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div className="flex justify-end">
      <Button 
        label="Update Status" 
        onClick={onSubmit} 
        isLoading={formLoading} 
        disabled={formLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors"
      />
    </div>
  </div>
);

export default TicketDetailsModal;