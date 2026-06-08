import { useLocation, useNavigate } from "react-router-dom";

const breadcrumbMap = {
  "ad-performance": "Ad Performance",
  "view-analytics": "View Analytics",
  "create-campaign": "Create Campaign",
  "campaigns-list": "Campaign List",
  "profile": "User Profile",
  "pos-upload": "POS Upload",
  "withdraw-earning": "Withdraw Earnings",
  "bids": "Bid Management",
  "reports": "Reports",
  "dashboard": "Dashboard",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/").filter(Boolean); // e.g. ["ad-performance", "view-analytics"]

  // Build a list of breadcrumb labels and paths
  const breadcrumbs = pathSegments.map((segment, index) => {
    const label =
      breadcrumbMap[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    const path = "/" + pathSegments.slice(0, index + 1).join("/");

    return { label, path, isLast: index === pathSegments.length - 1 };
  });

  return (
    <div className="text-sm text-gray-500 font-medium my-2 flex space-x-1">
      {breadcrumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center space-x-1">
          {!crumb.isLast ? (
            <button
              onClick={() => navigate(crumb.path)}
              className="hover:text-gray-800 hover:underline cursor-pointer"
            >
              {crumb.label}
            </button>
          ) : (
            <span>{crumb.label}</span>
          )}
          {i < breadcrumbs.length - 1 && <span>{">"}</span>}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
