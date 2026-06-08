import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAdminProfile } from "../../../redux/slices/admin/adminSlice";
import { fetchUserProfile } from "../../../redux/slices/user/userSlice";

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const adminToken = useSelector((state) => state.admin?.token);
  const userToken = useSelector((state) => state.user?.token);
  const adminUser = useSelector((state) => state.admin?.user);
  const normalUser = useSelector((state) => state.user?.user);

  // Fetch user profile when token changes
  useEffect(() => {
    if (adminToken && !adminUser) {
      dispatch(fetchAdminProfile());
    }
    if (userToken && !normalUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, adminToken, userToken]);

  if (adminToken) return adminUser;
  if (userToken) return normalUser;
  return null; // not logged in
};
