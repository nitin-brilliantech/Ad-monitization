import { Navigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role?.toLowerCase(); // normalize user role

    // Normalize all allowed roles to lowercase for comparison
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

    if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/signin" replace />;
  }
};

export default PrivateRoute;




// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token"); 
//   return token ? children : <Navigate to="/signin" replace />;
// };

// export default PrivateRoute;
