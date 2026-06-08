import React, { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal/Modal";
import { toast } from "react-hot-toast";
import MediaCarousel from "../../../components/ui/carousel/MediaCarousel";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  onStatusChange,
  onAdminRemarkChange,
  onSubmitChanges,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [remarkError, setRemarkError] = useState(false);
  const [localTicket, setLocalTicket] = useState(null);
  const [previousStatus, setPreviousStatus] = useState(null);
  const [showMediaCarousel, setShowMediaCarousel] = useState(false);

   const handleUserRemarkChange = (e) => {
    const newRemark = e.target.value;
    setLocalTicket({ ...localTicket, userRemark: newRemark });
    if (remarkError && newRemark.trim()) {
      setRemarkError(false);
    }
  };

  
  useEffect(() => {
    if (ticket) {
      setLocalTicket({ ...ticket });
      setPreviousStatus(ticket.status);
    }
  }, [ticket]);

  if (!localTicket) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return {
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-100",
          pulse: "bg-red-400",
          static: "bg-red-500"
        };
      case "Moderate":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          border: "border-amber-100",
          pulse: "bg-amber-400",
          static: "bg-amber-500"
        };
      case "Low":
        return {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-100",
          pulse: "bg-green-400",
          static: "bg-green-500"
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-100",
          pulse: "bg-gray-400",
          static: "bg-gray-500"
        };
    }
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

  const isEditable =
    localTicket.status === "RESOLVED" ||
    localTicket.status === "INPROGRESS" ||
    localTicket.status === "OPEN" ||
    localTicket.status === "REOPEN";
  const isClosed = localTicket.status === "CLOSED";

  const handleStatusChangeWithConfirmation = (newStatus) => {
    if (newStatus === "CLOSED") {
      setPendingStatus(newStatus);
      setShowConfirmation(true);
    } else {
      setPreviousStatus(localTicket.status);
      setLocalTicket({ ...localTicket, status: newStatus });
      onStatusChange(newStatus);
    }
  };

  const handleSubmit = () => {
    // For RESOLVED/REOPEN status, require userRemark
    if ((localTicket.status === "RESOLVED" || localTicket.status === "REOPEN") && 
        !localTicket.userRemark?.trim()) {
      setRemarkError(true);
      return;
    }
    
    if (isEditable && !localTicket.adminRemark?.trim()) {
      setRemarkError(true);
      return;
    }
    
    const ticketToSubmit = { ...localTicket };
    if (pendingStatus) {
      ticketToSubmit.status = pendingStatus;
    }

    onSubmitChanges(ticketToSubmit);
    onClose();

    toast.success(
      `Status for ticket ${localTicket.ticketNumber} has been changed by Admin from ${previousStatus} to ${pendingStatus || localTicket.status}`
    );
  };

  const handleConfirmClose = () => {
    if (!localTicket.adminRemark?.trim()) {
      setRemarkError(true);
      localTicket.status = isClosed
      setShowConfirmation(false);
      return;
    }
    setShowConfirmation(false);
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const handleRemarkChange = (e) => {
    const newRemark = e.target.value;
    setLocalTicket({ ...localTicket, adminRemark: newRemark });
    onAdminRemarkChange(newRemark);
    if (remarkError && newRemark.trim()) {
      setRemarkError(false);
    }
  };

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

  const PriorityPulseDot = ({ priority }) => {
    const colors = getPriorityColor(priority);
    return (
      <span className="relative flex size-3">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.pulse} opacity-75`}
        ></span>
        <span
          className={`relative inline-flex size-3 rounded-full ${colors.static}`}
        ></span>
      </span>
    );
  };

  const StatusPulseDot = ({ status }) => {
    const colors = getStatusColor(status);
    return (
      <span className="relative flex size-3">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.pulse} opacity-75`}
        ></span>
        <span
          className={`relative inline-flex size-3 rounded-full ${colors.static}`}
        ></span>
      </span>
    );
  };

  return (
    <div>
      {/* Main Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{localTicket?.subject}</h2>
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 ${getPriorityColor(localTicket.priority).bg
                } ${getPriorityColor(localTicket.priority).text} ${getPriorityColor(localTicket.priority).border
                }`}
            >
              {localTicket.priority}
              <PriorityPulseDot priority={localTicket.priority} />
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoBox label="Business Name" value={localTicket.businessName} />
            <InfoBox label="User Name" value={localTicket.userName} />
            <InfoBox label="Role" value={localTicket.role} />
            <InfoBox label="Created At" value={localTicket.createdAt} />
            <InfoBox label="Mobile" value={localTicket.mobile} />
            <InfoBox label="Email" value={localTicket.email} />
            <InfoBox label="Category" value={localTicket.category} />
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <div className={`mt-1 w-full px-3 py-2 ${getStatusColor(pendingStatus || localTicket.status).bg
                } ${getStatusColor(pendingStatus || localTicket.status).text
                } ${getStatusColor(pendingStatus || localTicket.status).border
                } rounded-md shadow-sm text-sm flex items-center gap-2`}>
                {pendingStatus || localTicket.status}
                <StatusPulseDot status={pendingStatus || localTicket.status} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm min-h-[80px]">
              {localTicket.description}
            </div>
          </div>

          {/* Media Preview Grid */}
          {localTicket.media?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Media Submitted by User</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {localTicket.media.map((url, index) => renderMediaPreview(url, index))}
              </div>
            </div>
          )}

          {(localTicket.status === "RESOLVED" || localTicket.status === "REOPEN") && (
            <div>
             <InfoBox label="userRemark" value={localTicket.userRemark} />
              
            </div>
          )}

           {/* User Remark  prewritten*/}
          <div>
            <InfoBox label="User Remark" value={localTicket.userRemark} />
          </div>


          {/* Status Select */}
          {isEditable && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <label className="text-sm font-medium text-gray-600">Update Status:</label>
              <select
                className="w-60 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2"
                value={pendingStatus || localTicket.status}
                onChange={(e) => handleStatusChangeWithConfirmation(e.target.value)}
              >

                <option value="INPROGRESS">INPROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          )}

          {/* Admin Remark */}
          <div>
            <label className="text-sm text-gray-600">
              Admin Remark <span className="text-red-500">*</span>
            </label>
            {isClosed ? (
              <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
                {localTicket.adminRemark || "—"}
              </div>
            ) : (
              <>
                <textarea
                  rows={3}
                  value={localTicket.adminRemark || ""}
                  onChange={handleRemarkChange}
                  className={`mt-1 w-full px-3 py-2 text-gray-800 bg-white border ${remarkError ? "border-red-500" : "border-gray-200"
                    } rounded-md shadow-sm text-sm`}
                  placeholder="Enter admin remark..."
                  required
                />
                {remarkError && (
                  <p className="text-red-500 text-xs mt-1">Admin remark is required</p>
                )}
              </>
            )}
          </div>

          {/* Submit Button */}
          {isEditable && (
            <div className="flex justify-end">
              <button
                className="px-5 py-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!localTicket.adminRemark?.trim()}
              >
                Update Status
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Media Carousel Modal */}
      {showMediaCarousel && (
        <Modal
          isOpen={true}
          onClose={() => setShowMediaCarousel(false)}
          size="lg"
          showCloseButton={false}
          bgcolor="bg-black bg-opacity-90"
        >
          <MediaCarousel
            mediaFiles={localTicket.media}
            onClose={() => setShowMediaCarousel(false)}
          />
        </Modal>
      )}

      {/* Confirm Modal */}
      {showConfirmation && (
        <Modal isOpen={true} onClose={handleCancelClose} size="md" showCloseButton={false}>
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Confirm Ticket Closure</h3>
            <p>Are you sure you want to close this ticket?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancelClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmClose}
                disabled={!localTicket.adminRemark?.trim()}
              >
                Confirm Close
              </button>
            </div>
            {!localTicket.adminRemark?.trim() && (
              <p className="text-red-500 text-sm">
                Please enter an admin remark before closing
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
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










// import React, { useState, useEffect } from "react";
// import { Modal } from "../../components/ui/modal/Modal";
// import { toast } from "react-hot-toast";
// import MediaCarousel from "../../components/Media/MediaCarousel";

// const TicketDetailsModal = ({
//   isOpen,
//   onClose,
//   ticket,
//   onStatusChange,
//   onAdminRemarkChange,
//   onSubmitChanges,
// }) => {
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState(null);
//   const [remarkError, setRemarkError] = useState(false);
//   const [localTicket, setLocalTicket] = useState(null);
//   const [previousStatus, setPreviousStatus] = useState(null);
//   const [showMediaCarousel, setShowMediaCarousel] = useState(false);

//   useEffect(() => {
//     if (ticket) {
//       setLocalTicket({ ...ticket });
//       setPreviousStatus(ticket.status);
//     }
//   }, [ticket]);

//   if (!localTicket) return null;

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "Critical":
//         return {
//           bg: "bg-red-50",
//           text: "text-red-600",
//           border: "border-red-100",
//           pulse: "bg-red-400",
//           static: "bg-red-500"
//         };
//       case "Moderate":
//         return {
//           bg: "bg-amber-50",
//           text: "text-amber-600",
//           border: "border-amber-100",
//           pulse: "bg-amber-400",
//           static: "bg-amber-500"
//         };
//       case "Low":
//         return {
//           bg: "bg-green-50",
//           text: "text-green-600",
//           border: "border-green-100",
//           pulse: "bg-green-400",
//           static: "bg-green-500"
//         };
//       default:
//         return {
//           bg: "bg-gray-50",
//           text: "text-gray-600",
//           border: "border-gray-100",
//           pulse: "bg-gray-400",
//           static: "bg-gray-500"
//         };
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return {
//           bg: "bg-red-50",
//           text: "text-red-600",
//           border: "border-red-100",
//         };
//       case "In Progress":
//         return {
//           bg: "bg-yellow-50",
//           text: "text-yellow-600",
//           border: "border-yellow-100",
//         };
//       case "Closed":
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

//   const isEditable =
//     localTicket.status === "Pending" || localTicket.status === "In Progress";
//   const isClosed = localTicket.status === "Closed";

//   const handleStatusChangeWithConfirmation = (newStatus) => {
//     if (newStatus === "Closed") {
//       setPendingStatus(newStatus);
//       setShowConfirmation(true);
//     } else {
//       setPreviousStatus(localTicket.status);
//       setLocalTicket({ ...localTicket, status: newStatus });
//       onStatusChange(newStatus);
//     }
//   };

//   const handleSubmit = () => {
//     if (isEditable && !localTicket.adminRemark?.trim()) {
//       setRemarkError(true);
//       return;
//     }
//     const ticketToSubmit = { ...localTicket };
//     if (pendingStatus) {
//       ticketToSubmit.status = pendingStatus;
//     }

//     onSubmitChanges(ticketToSubmit);
//     onClose();

//     toast.success(
//       `Status for ticket ${localTicket.ticketNumber} has been changed by Admin from ${previousStatus} to ${pendingStatus || localTicket.status}`
//     );
//   };

//   const handleConfirmClose = () => {
//     if (!localTicket.adminRemark?.trim()) {
//       setRemarkError(true);
//       localTicket.status = isClosed
//       setShowConfirmation(false);
//       return;
//     }
//     setShowConfirmation(false);
//   };

//   const handleCancelClose = () => {
//     setShowConfirmation(false);
//     setPendingStatus(null);
//   };

//   const handleRemarkChange = (e) => {
//     const newRemark = e.target.value;
//     setLocalTicket({ ...localTicket, adminRemark: newRemark });
//     onAdminRemarkChange(newRemark);
//     if (remarkError && newRemark.trim()) {
//       setRemarkError(false);
//     }
//   };

//   const renderMediaPreview = (url, index) => {
//     const extension = url.split('.').pop().toLowerCase();
//     const fileName = url.split('/').pop();
//     const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
//     const isVideo = ['mp4', 'webm', 'mov'].includes(extension);

//     return (
//       <div
//         key={index}
//         className="rounded-md overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
//         onClick={() => setShowMediaCarousel(true)}
//       >
//         <div className="h-32 flex items-center justify-center relative">
//           {isImage ? (
//             <img
//               src={url}
//               alt={`ticket-media-${index}`}
//               className="w-full h-full object-contain p-1"
//             />
//           ) : isVideo ? (
//             <div className="relative w-full h-full">
//               <video className="w-full h-full object-contain pointer-events-none">
//                 <source src={url} type={`video/${extension}`} />
//               </video>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-4xl">▶️</span>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center p-4 w-full">
//               <div className="mx-auto mb-2 text-4xl">
//                 {extension === 'pdf' ? '📄' : '📁'}
//               </div>
//               <span className="text-xs mt-2 line-clamp-2">{fileName}</span>
//             </div>
//           )}
//         </div>
//         <div className="p-2 bg-white">
//           <span className="text-xs text-gray-600 truncate block">{fileName}</span>
//         </div>
//       </div>
//     );
//   };

//   const PriorityPulseDot = ({ priority }) => {
//     const colors = getPriorityColor(priority);
//     return (
//       <span className="relative flex size-3">
//         <span
//           className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.pulse} opacity-75`}
//         ></span>
//         <span
//           className={`relative inline-flex size-3 rounded-full ${colors.static}`}
//         ></span>
//       </span>
//     );
//   };

//   const StatusPulseDot = ({ status }) => {
//     const colors = getStatusColor(status);
//     return (
//       <span className="relative flex size-3">
//         <span
//           className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.pulse} opacity-75`}
//         ></span>
//         <span
//           className={`relative inline-flex size-3 rounded-full ${colors.static}`}
//         ></span>
//       </span>
//     );
//   };

//   return (
//     <div>
//       {/* Main Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
//         <div className="p-6 space-y-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-semibold">{localTicket?.subject}</h2>
//             <span
//               className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2 ${getPriorityColor(localTicket.priority).bg
//                 } ${getPriorityColor(localTicket.priority).text} ${getPriorityColor(localTicket.priority).border
//                 }`}
//             >
//               {localTicket.priority}
//               <PriorityPulseDot priority={localTicket.priority} />
//             </span>
//           </div>

//           {/* Info */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//             <InfoBox label="Business Name" value={localTicket.businessName} />
//             <InfoBox label="User Name" value={localTicket.userName} />
//             <InfoBox label="Role" value={localTicket.role} />
//             <InfoBox label="Created At" value={localTicket.createdAt} />
//             <InfoBox label="Mobile" value={localTicket.mobile} />
//             <InfoBox label="Email" value={localTicket.email} />
//             <InfoBox label="Category" value={localTicket.category} />
//             <div>
//               <label className="text-sm text-gray-600">Status</label>
//               <div className={`mt-1 w-full px-3 py-2 ${getStatusColor(pendingStatus || localTicket.status).bg
//                 } ${getStatusColor(pendingStatus || localTicket.status).text
//                 } ${getStatusColor(pendingStatus || localTicket.status).border
//                 } rounded-md shadow-sm text-sm flex items-center gap-2`}>
//                 {pendingStatus || localTicket.status}
//                 <StatusPulseDot status={pendingStatus || localTicket.status} />
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-sm text-gray-600">Description</label>
//             <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm min-h-[80px]">
//               {localTicket.description}
//             </div>
//           </div>

//           {/* Media Preview Grid */}
//           {localTicket.media?.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-sm font-semibold text-gray-600 mb-2">Media Submitted by User</h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                 {localTicket.media.map((url, index) => renderMediaPreview(url, index))}
//               </div>
//             </div>
//           )}

//           {/* Status Select */}
//           {isEditable && (
//             <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//               <label className="text-sm font-medium text-gray-600">Update Status:</label>
//               <select
//                 className="w-60 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2"
//                 value={pendingStatus || localTicket.status}
//                 onChange={(e) => handleStatusChangeWithConfirmation(e.target.value)}
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>
//           )}

//           {/* Admin Remark */}
//           <div>
//             <label className="text-sm text-gray-600">
//               Admin Remark <span className="text-red-500">*</span>
//             </label>
//             {isClosed ? (
//               <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
//                 {localTicket.adminRemark || "—"}
//               </div>
//             ) : (
//               <>
//                 <textarea
//                   rows={3}
//                   value={localTicket.adminRemark || ""}
//                   onChange={handleRemarkChange}
//                   className={`mt-1 w-full px-3 py-2 text-gray-800 bg-white border ${remarkError ? "border-red-500" : "border-gray-200"
//                     } rounded-md shadow-sm text-sm`}
//                   placeholder="Enter admin remark..."
//                   required
//                 />
//                 {remarkError && (
//                   <p className="text-red-500 text-xs mt-1">Admin remark is required</p>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Submit Button */}
//           {isEditable && (
//             <div className="flex justify-end">
//               <button
//                 className="px-5 py-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSubmit}
//                 disabled={!localTicket.adminRemark?.trim()}
//               >
//                 Update Status
//               </button>
//             </div>
//           )}
//         </div>
//       </Modal>

//       {/* Media Carousel Modal */}
//       {showMediaCarousel && (
//         <Modal
//           isOpen={true}
//           onClose={() => setShowMediaCarousel(false)}
//           size="lg"
//           showCloseButton={false}
//           bgcolor="bg-black bg-opacity-90"
//         >
//           <MediaCarousel
//             mediaFiles={localTicket.media}
//             onClose={() => setShowMediaCarousel(false)}
//           />
//         </Modal>
//       )}

//       {/* Confirm Modal */}
//       {showConfirmation && (
//         <Modal isOpen={true} onClose={handleCancelClose} size="md" showCloseButton={false}>
//           <div className="p-6 space-y-4">
//             <h3 className="text-lg font-semibold">Confirm Ticket Closure</h3>
//             <p>Are you sure you want to close this ticket?</p>
//             <div className="flex justify-end gap-4">
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                 onClick={handleCancelClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleConfirmClose}
//                 disabled={!localTicket.adminRemark?.trim()}
//               >
//                 Confirm Close
//               </button>
//             </div>
//             {!localTicket.adminRemark?.trim() && (
//               <p className="text-red-500 text-sm">
//                 Please enter an admin remark before closing
//               </p>
//             )}
//           </div>
//         </Modal>
//       )}
//     </div>
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