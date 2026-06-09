import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/user/userSlice";
import { logoutAdmin } from "../../../redux/slices/admin/adminSlice";
import { closeCampaignSSE } from "../../../util/services/sseService";
import { clearCampaigns } from "../../../redux/slices/user/approvedCampaignSlice";
import { UserPlus, User, LogOut } from "lucide-react";

// Role badge colours
const ROLE_STYLE = {
  SUPERADMIN: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm",
  ADMIN:      "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
  Retailer:   "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm",
  "Ad-Agency":"bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm",
};

const getRoleLabel = (role) => {
  const map = {
    SUPERADMIN: "Super Admin",
    ADMIN:      "Admin",
    Retailer:   "Retailer",
    "Ad-Agency":"Ad Agency",
  };
  return map[role] || role;
};

// Menu item wrapper
const MenuItem = ({ onClick, to, icon, label, danger = false, onClose }) => {
  const base = `flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-xl
    transition-all duration-150 cursor-pointer
    ${danger
      ? "text-red-500 hover:bg-red-50"
      : "text-gray-600 hover:bg-[#4684ff]/6 hover:text-[#4684ff]"
    }`;

  if (to) {
    return (
      <Link to={to} className={base} onClick={onClose}>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm
          ${danger ? "bg-red-100 text-red-500" : "bg-[#4684ff]/10 text-[#4684ff]"}`}>
          {icon}
        </span>
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm
        ${danger ? "bg-red-100 text-red-500" : "bg-[#4684ff]/10 text-[#4684ff]"}`}>
        {icon}
      </span>
      {label}
    </button>
  );
};

const UserProfile = ({ profile, onAddAdminClick, onClose }) => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = () => {
    if (["SUPERADMIN", "ADMIN"].includes(profile?.role)) {
      dispatch(logoutAdmin());
    } else {
      dispatch(logoutUser());
      if (profile?.role === "Retailer") {
        closeCampaignSSE();
        dispatch(clearCampaigns());
      }
    }
    navigate("/signin");
  };

  const name   = profile?.name || profile?.fullName || "User";
  const email  = profile?.email || "";
  const avatar = profile?.avatar || profile?.profile_url;
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-slideDown">

      {/* Header — avatar + name + role badge */}
      <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-[#4684ff]/8 to-[#4684ff]/3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4684ff] to-[#3a6fe6] flex items-center justify-center text-white font-semibold text-sm shadow-sm border-2 border-white">
              {initials}
            </div>
          )}

          {/* Name + email + role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
            {email && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{email}</p>
            )}
            {profile?.role && (
              <span className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${ROLE_STYLE[profile.role] ?? "bg-gray-100 text-gray-600"}`}>
                {getRoleLabel(profile.role)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2 flex flex-col gap-0.5">
        {profile?.role === "SUPERADMIN" && onAddAdminClick && (
          <MenuItem
            onClick={onAddAdminClick}
            icon={<UserPlus size={16} />}
            label="Add Admin"
          />
        )}

        <MenuItem
          to="/profile"
          icon={<User size={16} />}
          label="My Profile"
          onClose={onClose}
        />

        {/* Divider */}
        <div className="my-1 border-t border-gray-100" />

        <MenuItem
          onClick={handleLogout}
          danger
          icon={<LogOut size={16} />}
          label="Sign Out"
        />
      </div>
    </div>
  );
};

export default UserProfile;
