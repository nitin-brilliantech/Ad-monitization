import { Switch } from "@mui/material";
import Loader from "../../../components/loader/Loader";
import StatusBadge from "../../../components/ui/badges/StatusBadge";

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
  render: (row) => {
    if (switchLoading?.[row.id]) {
      return <Loader className="p-0" size="small" />;
    }
    return (
      <Switch
        checked={row.isActive}
        disabled={row?.isExpired}
        onChange={() => handleActivate(row.id, row.isActive)}
        size="small"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#445C91" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "#445C91",
          },
        }}
      />
    );
  },
},

];

export default getColumns;