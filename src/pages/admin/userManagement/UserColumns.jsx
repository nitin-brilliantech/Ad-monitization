
import { Chip, Switch } from "@mui/material";
import Loader from "../../../components/loader/Loader"
import COLORS from "../../../constants/Colors";
export const columns = (handleStatusChange,switchLoading) => [
  { id: "fullName", label: "Full Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone Number" },
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
  {
    id: "status",
    label: "Status",
   render: (row) => {
  if (switchLoading?.[row.id]) {
    return (
      <Loader size="small" />
    );
  } else {
    return (
      <Switch
        checked={row.status === "ACTIVE"}
        onChange={() => handleStatusChange(row.id, row.status)}
        size="small"
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: COLORS.newBlue },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: COLORS.newBlue,
          },
        }}
      />
    );
  }
}

  },
];