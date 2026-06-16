import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addTicket,
  fetchAllTickets,
  updateTicketStatus,
} from "../../../redux/slices/user/ticketsSlice";
import Button from "../../../components/ui/button/Button";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import FormBuilder from "../../../components/form/FromBuilder";
import TicketDetailsModal from "../../shared/TicketDetailsModal";
import Toast from "../../../components/ui/toast/Toast";
import ChatOption from "../../../components/chat/ChatOption";

const TicketRaise = () => {
  const dispatch = useDispatch();
  const { list: tickets = [], loading } = useSelector((state) => state.tickets || { list: [], loading: false });

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const methods = useForm();

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const openTicketModal = () => setIsTicketModalOpen(true);
  const closeTicketModal = () => setIsTicketModalOpen(false);

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTicket(null);
  };

  const columns = [
    {
      id: "ticketCode",
      label: "Ticket#",
    },
    {
      id: "queryType",
      label: "Issue",
    },
    {
      id: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const statusColors = {
          ACTIVE: "bg-orange-50 text-orange-700 border-orange-200",
          CLOSED: "bg-red-50 text-red-700 border-red-200",
          RESOLVED: "bg-green-50 text-green-700 border-green-200",
        };
        const colorClass = statusColors[row.status] || "bg-gray-50 text-gray-700 border-gray-200";
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const ticketFields = [
    [
      {
        name: "queryType",
        label: "Query Type",
        type: "select",
        options: [
          { label: "Payment", value: "payment" },
          { label: "Device", value: "device" },
          { label: "Campaign", value: "campaign" },
          { label: "Other", value: "other" },
        ],
        required: true,
        gridSpan: 1,
      },
    ],
    [
      {
        name: "description",
        label: "Description",
        type: "text-area",
        placeholder: "Please describe your issue in detail...",
        required: true,
      },
    ],
    [
      {
        name: "media",
        label: "Upload Media",
        type: "file",
        accept: "image/*,.pdf,.doc,.docx",
        multiple: true,
        helperText: "Format: jpeg, png, mp4. Max file size: 5MB.",
      },
    ],
  ];

  const handleRowClick = (row) => {
    setSelectedTicket(row);
    setIsDetailsModalOpen(true);
  };

  const handleUpdate = useCallback(
    async (data) => {
      try {
        await dispatch(updateTicketStatus({ id: selectedTicket.id, data }));
        handleCloseDetailsModal();
        Toast.success("Raised!", "Ticket status updated successfully!");
      } catch (error) {
        Toast.error(
          "Failed!",
          error.message || "Failed to update status of Ticket!"
        );
        console.error(error);
      }
    },
    [dispatch, selectedTicket?.id]
  );

  const handleSubmitTicket = useCallback(
    async (data) => {
      console.log("submitting data", data);
      try {
        await dispatch(addTicket(data));
        closeTicketModal();
        methods.reset();
        Toast.success("Raised!", "Ticket raised successfully!");
      } catch (error) {
        console.log(error);
        Toast.error("Failed!", error.message || "Failed to raise the Ticket!");
      }
    },
    [dispatch, methods]
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Tickets</h2>
        <Button
          isIcon={false}
          label="Raise Ticket"
          onClick={openTicketModal}
          type="button"
        />
      </div>

      <div className="flex w-full justify-between space-x-4">
        <div className="w-2/3">
          <ReusableTable
            columns={columns}
            rows={(tickets || []).map((ticket, idx) => ({ 
              ...ticket, 
              id: ticket.id || ticket.ticketCode || `ticket-${idx}` 
            }))}
            filterOptions={["all", "ACTIVE", "RESOLVED", "CLOSED"]}
            filterKey="status"
            onRowClick={handleRowClick}
            loading={loading}
            onRefresh={() => dispatch(fetchAllTickets())}
            searchableColumns={["queryType", "ticketCode", "status"]}
          />
        </div>
        <div className="w-1/3">
          <ChatOption />
        </div>
      </div>

      <Modal
        isOpen={isTicketModalOpen}
        onClose={closeTicketModal}
        size="lg"
        showCloseButton={false}
      >
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Raise a Ticket</h2>
                <p className="text-blue-100 text-sm mt-1">Submit your support request and we'll get back to you soon</p>
              </div>
              <button
                onClick={closeTicketModal}
                className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <FormBuilder
              title=""
              onSubmit={handleSubmitTicket}
              fieldsConfig={ticketFields}
              methods={methods}
              submitLabel="Submit Ticket"
              isPlus={false}
              loading={loading}
            />
          </div>
        </div>
      </Modal>

      <TicketDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        ticket={selectedTicket}
        role="user"
        onSubmit={handleUpdate}
        formLoading={loading}
      />
    </div>
  );
};

export default TicketRaise;
