import React, { useState } from "react";
import { Modal } from "../../../components/ui/modal/Modal";
import Toast from "../../../components/ui/toast/Toast";
import Select from "react-select";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "8px",
    borderWidth: "1px",
    borderColor: state.isFocused ? "#4684ff" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(70,132,255,0.1)" : "none",
    backgroundColor: "#ffffff",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
    "&:hover": { borderColor: state.isFocused ? "#4684ff" : "#a0aec0" },
    cursor: "pointer",
  }),
  valueContainer: (base) => ({ ...base, padding: "0 12px" }),
  input: (base) => ({ 
    ...base, 
    margin: 0, 
    padding: 0,
    outline: 0,
    border: 0,
    boxShadow: "none",
    "& input": {
      outline: "0 !important",
      border: "0 !important",
      boxShadow: "none !important",
    },
    "& input:focus": {
      outline: "0 !important",
      border: "0 !important", 
      boxShadow: "none !important",
    }
  }),
  singleValue: (base) => ({ ...base, fontSize: "14px", color: "#111827" }),
  placeholder: (base) => ({ ...base, fontSize: "14px", color: "#9ca3af" }),
  indicatorSeparator: () => ({ display: "none" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    marginTop: "4px",
  }),
  menuList: (base) => ({ ...base, padding: "4px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    borderRadius: "6px",
    margin: "1px 0",
    padding: "8px 12px",
    backgroundColor: state.isSelected
      ? "#4684ff"
      : state.isFocused
      ? "rgba(70,132,255,0.08)"
      : "transparent",
    color: state.isSelected ? "#fff" : "#111827",
    cursor: "pointer",
  }),
};

const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
  const [userRemark, setUserRemark] = useState("");
  const [status, setStatus] = useState(ticket?.status || "OPEN");
  const [remarkError, setRemarkError] = useState(false);

  if (!ticket) return null;

   const renderMediaPreview = (url, index) => {
    const extension = url.split('.').pop().toLowerCase();
    const fileName = url.split('/').pop();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    const isVideo = ['mp4', 'webm', 'mov'].includes(extension);

    return (
      <div
        key={index}
        className="rounded-md overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => setShowMediaCarousel(true)}
      >
        <div className="h-32 flex items-center justify-center relative">
          {isImage ? (
            <img
              src={url}
              alt={`ticket-media-${index}`}
              className="w-full h-full object-contain p-1"
            />
          ) : isVideo ? (
            <div className="relative w-full h-full">
              <video className="w-full h-full object-contain pointer-events-none">
                <source src={url} type={`video/${extension}`} />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">▶️</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 w-full">
              <div className="mx-auto mb-2 text-4xl">
                {extension === 'pdf' ? '📄' : '📁'}
              </div>
              <span className="text-xs mt-2 line-clamp-2">{fileName}</span>
            </div>
          )}
        </div>
        <div className="p-2 bg-white">
          <span className="text-xs text-gray-600 truncate block">{fileName}</span>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return {
          bg: "bg-orange-50",
          text: "text-orange-600",
          border: "border-orange-100",
        };
      case "INPROGRESS":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          border: "border-yellow-100",
        };
      case "RESOLVED":
        return {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-100",
        };
      case "REOPEN":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-100",
        };
      case "CLOSED":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-100",
        };
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUserRemarkChange = (e) => {
    setUserRemark(e.target.value);
    if (remarkError && e.target.value.trim()) {
      setRemarkError(false);
    }
  };

  const handleSubmit = () => {
    if (!userRemark.trim()) {
      setRemarkError(true);
      return;
    }

    // Here you would typically call an API to update the ticket
    console.log("Updating ticket:", {
      id: ticket.ticketID,
      status,
      userRemark
    });

    Toast.success("Ticket Updated", `Ticket ${ticket.ticketID} status updated to ${status}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
      <div className="p-6 mt-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{ticket.subject}</h2>
          <span
            className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(ticket.status).bg
              } ${getStatusColor(ticket.status).text} ${getStatusColor(ticket.status).border
              }`}
          >
            {ticket.status}
          </span>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoBox label="Ticket ID" value={ticket.ticketID} />
          <InfoBox label="Raised At" value={ticket.raisedAt} />
          <InfoBox label="Status" value={ticket.status} />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm min-h-[80px]">
            {ticket.description || "No additional details provided"}
          </div>
        </div>

        {/* Media Section */}
        {ticket.media && ticket.media.length > 0 && (
          <div>
            <label className="text-sm text-gray-600">Media Submitted by User</label>
            <div className="mt-2 flex gap-2">
              {ticket.media.map((url, index) => renderMediaPreview(url, index))}
            </div>
          </div>
        )}
        
        {/* Admin Remark prewritten*/}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Admin Remark
          </label>
          <InfoBox value={ticket.adminRemark} />
        </div>

        {/* Status Update Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Update Status</label>
            <div className="mt-1">
              <Select
                options={[
                  { label: "RESOLVED", value: "RESOLVED" },
                  { label: "REOPEN", value: "REOPEN" },
                ]}
                value={{ label: status, value: status }}
                onChange={(selected) => handleStatusChange({ target: { value: selected.value } })}
                styles={selectStyles}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                classNamePrefix="ticket-status-select"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              User Remark <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={userRemark}
              onChange={handleUserRemarkChange}
              className={`mt-1 w-full px-3 py-2 text-gray-800 bg-white border ${remarkError ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter user remark..."
            />
            {remarkError && (
              <p className="mt-1 text-sm text-red-600">User remark is required</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Status
          </button>
        </div>
      </div>
    </Modal>
  );
};

const InfoBox = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
      {value || "—"}
    </div>
  </div>
);

export default TicketDetailsModal;







// import React, { useState } from "react";
// import { Modal } from "../../components/ui/modal/Modal";

// const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
//   if (!ticket) return null;

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "OPEN":
//         return {
//           bg: "bg-orange-50",
//           text: "text-orange-600",
//           border: "border-orange-100",
//         };
//       case "INPROGRESS":
//         return {
//           bg: "bg-yellow-50",
//           text: "text-yellow-600",
//           border: "border-yellow-100",
//         };
//       case "RESOLVED":
//         return {
//           bg: "bg-blue-50",
//           text: "text-blue-600",
//           border: "border-blue-100",
//         };
//       case "REOPEN":
//         return {
//           bg: "bg-red-50",
//           text: "text-red-600",
//           border: "border-red-100",
//         };
//       case "CLOSED":
//         return {
//           bg: "bg-green-50",
//           text: "text-green-600",
//           border: "border-green-100",
//         };
//       default:
//         return {
//           bg: "bg-gray-50",
//           text: "text-gray-600",
//           border: "border-gray-100",
//         };
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
//       <div className="p-6 mt-8 space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold">{ticket.subject}</h2>
//           <span
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               getStatusColor(ticket.status).bg
//             } ${getStatusColor(ticket.status).text} ${
//               getStatusColor(ticket.status).border
//             }`}
//           >
//             {ticket.status}
//           </span>
//         </div>

//         {/* Info */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//           <InfoBox label="Ticket ID" value={ticket.ticketID} />
//           <InfoBox label="Subject" value={ticket.subject} />
//           <InfoBox label="Raised At" value={ticket.raisedAt} />
//           <InfoBox label="Status" value={ticket.status} />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="text-sm text-gray-600">Description</label>
//           <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm min-h-[80px]">
//             {ticket.description || "No additional details provided"}
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// const InfoBox = ({ label, value }) => (
//   <div>
//     <label className="text-sm text-gray-600">{label}</label>
//     <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
//       {value || "—"}
//     </div>
//   </div>
// );

// export default TicketDetailsModal;
