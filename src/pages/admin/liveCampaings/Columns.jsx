import StatusBadge from "../../../components/ui/badges/StatusBadge";
import LiquidToggle from "../../../components/ui/toggle/LiquidToggle";

const getColumns = (handleActivate, switchLoading) => [
  { id: "campaignCode", label: "Campaign ID" },
  { id: "name", label: "Campaign Name" },
  { id: "brandName", label: "Brand Name" },
  {
    id: "dateRange",
    label: "Schedule",
    render: (row) =>
      `${new Date(row.startDate).toLocaleDateString()} - ${new Date(
        row.endDate
      ).toLocaleDateString()}`,
  },
  // {
  //   id: "regions",
  //   label: "Regions",
  //   render: (row) => row.regions?.join(", ") || "N/A",
  // },
  {
    id: "baseBid",
    label: "Amount",
    render: (row) => `₹ ${row.baseBid}`,
  },


{
  id: "status",
  label: "Status",
  render: (row) => (  
    <StatusBadge isActive={row.isActive} isExpired={row.isExpired} size={11} />
  ),
}
,
{
  id: "actions",
  label: "Actions",
  render: (row) => (
    <LiquidToggle
      checked={row.isActive}
      disabled={row?.isExpired}
      onChange={() => handleActivate(row.id, row.isActive)}
      size="sm"
    />
  ),
},

];

export default getColumns;