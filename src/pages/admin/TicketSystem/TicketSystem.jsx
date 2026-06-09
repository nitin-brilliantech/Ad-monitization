import { useState } from "react";
import { Typography, Chip } from "@mui/material";
import StatCard from "../../../components/card/StatCard";
import ReusableTable from "../../../components/table/ReusableTable";
import TicketDetailsModal from "./TicketDetailsModal";
import { ticketCounts, ticketRows } from "./ticketData";
import Toast from "../../../components/ui/toast/Toast";
import TicketStatusBadge from "../../../components/ui/badges/TicketStatusBadge";

const TicketSystem = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState(ticketRows);

  const counts = ticketCounts(rows);

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleStatusChange = (newStatus) => {
    setSelectedTicket((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleAdminRemarkChange = (remark) => {
    setSelectedTicket((prev) => ({
      ...prev,
      adminRemark: remark,
    }));
  };

 const handleSubmitChanges = async (updatedTicket) => {
  const { id, status, adminRemark, userRemark, ticketID } = updatedTicket;

  const prevRow = rows.find((row) => row.id === id);
  const prevStatus = prevRow?.status;

  
  await new Promise((resolve) => setTimeout(resolve, 300));

  const updatedRows = rows.map((row) =>
    row.id === id ? { ...row, status, adminRemark, userRemark } : row
  );
  setRows(updatedRows);

  Toast.success(
    `Status for ticket ${ticketID} has been changed by Admin from "${prevStatus}" to "${status}".`
  );

  setIsModalOpen(false);
  setSelectedTicket(null);
};

  const statsData = [
    {
      title: "Total Tickets",
      value: counts.total.toString(),
      currency: false,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-60",
    },
    {
      title: "Open",
      value: counts.open.toString(),
      currency: false,
      changeColor: "text-orange-600",
      bgGradient: "bg-gradient-to-br from-white via-orange-50 to-orange-100",
    },
    {
      title: "In Progress",
      value: counts.inProgress.toString(),
      currency: false,
      changeColor: "text-yellow-600",
      bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
    },
    {
      title: "Resolved",
      value: counts.resolved.toString(),
      currency: false,
      changeColor: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-white via-blue-50 to-blue-100",
    },
    {
      title: "Reopen",
      value: counts.reopen.toString(),
      currency: false,
      changeColor: "text-red-600",
      bgGradient: "bg-gradient-to-br from-white via-red-50 to-red-100",
    },
  ];

  const columns = [
    {
      id: "ticketID",
      label: "Ticket ID"
    },
    
    {
      id: "subject",
      label: "Subject"
    },
    
    { id: "priority", label: "Priority" },
    
    {
      id: "status",
      label: "Status",
      render: (row) => <TicketStatusBadge status={row.status} size={11} />,
    },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          sx={{
            backgroundColor: row.role === "Retailer" ? "#10b981" : "#5B7FE5",
            color: "white",
            fontWeight: 600,
            px: 1.5,
            borderRadius: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },
    { id: "raisedAt", label: "Raised At" },
  ];

  return (
    <div>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Ticket System
      </Typography>

      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
      >
        {statsData.map((item, index) => (
          <StatCard
          
           key={index} {...item} />
        ))}
      </div>

      <div className="mt-4">
        <ReusableTable
          columns={columns}
          rows={rows}
          filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "REOPEN", "CLOSED"]}
          filterKey="status"
          onRowClick={handleOpenModal} 
          searchableColumns={["ticketID","subject","priority","raisedAt"]}
        />
      </div>

      <TicketDetailsModal
        isOpen={isModalOpen}
        onClose={handleClose}

        ticket={selectedTicket}
        onStatusChange={handleStatusChange}
        onAdminRemarkChange={handleAdminRemarkChange}
        onSubmitChanges={handleSubmitChanges}
      />
    </div>
  );
};

export default TicketSystem;