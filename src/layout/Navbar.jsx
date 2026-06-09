import { useState, useRef, useEffect, useMemo } from "react";
import {useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { agencyRouteMap, retailerRouteMap, adminRouteMap } from "../routes/routeMaps"; // ✅ import all maps
import SearchBar from "../components/ui/search-bar/SearchBar";
import { Modal } from "../components/ui/modal/Modal";
import AddAdminForm from "../components/ui/user/AddAdminForm";
import UserProfile from "../components/ui/user/UserProfile";
import { fetchUserProfile } from "../redux/slices/user/userSlice";
import { fetchAdminProfile } from "../redux/slices/admin/adminSlice";
import { useCurrentUser } from "../components/ui/user/CurrentUser";

const languages = [
  { label: "English", code: "en" },
  { label: "हिंदी", code: "hi" },
  { label: "ಕನ್ನಡ", code: "kn" },
];

const Navbar = ({ toggleSidebar }) => {
  const user = useCurrentUser();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileRef = useRef();

  const dispatch = useDispatch();

  // fetch correct profile depending on role
  useEffect(() => {
    if (!user?.role) return; // don't dispatch until role is known

    const isAdmin = ["SUPERADMIN", "ADMIN"].includes(user.role);

    dispatch(isAdmin ? fetchAdminProfile() : fetchUserProfile());
  }, [dispatch, user?.role]);

  // close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside); // not mousedown
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //  pick routeMap dynamically based on role
  const availableRoutes = useMemo(() => {
    if (!user?.role) return [];
    if (["SUPERADMIN", "ADMIN"].includes(user.role)) return adminRouteMap;
    if (user.role === "Retailer") return retailerRouteMap;
    if (user.role === "Ad-Agency") return agencyRouteMap;
    return [];
  }, [user?.role]);

  // const handleSearch = (value) => {
  //   setQuery(value);
  //   if (!value.trim()) return setResult([]);
  //   const filtered = availableRoutes
  //     .filter((route) => route.name && route.path)
  //     .filter((route) =>
  //       route.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //   setResult(filtered);
  // };



  const handleSearch = (value) => {
  setQuery(value);
  if (!value.trim()) {
    setResult([]);
    return;
  }

  const searchTerm = value.toLowerCase();

  const filtered = availableRoutes.filter((route) => {
    const inName = route.name?.toLowerCase().includes(searchTerm);
    const inKeywords = route.keywords?.some((kw) =>
      kw.toLowerCase().includes(searchTerm)
    );
    return inName || inKeywords;
  });

  setResult(filtered);
};

  return (
    <div className="h-20 bg-white shadow-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: Sidebar + Search */}
      <div className="flex items-center gap-3 w-full max-w-lg">
        <button className="md:hidden text-xl" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="relative">
          <SearchBar
            value={query}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-[280px]"
          />
          {query && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {result.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {result.map((item, index) => (
                    <li
                      key={index}
                      className="hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <Link
                        to={item.path}
                        onClick={() => {
                          setQuery("");
                          setResult([]);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Lang + Profile */}
      <div className="flex items-center gap-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile((prev) => !prev)}
            className="cursor-pointer flex items-center gap-2"
          >
            <img
              src={user?.avatar || user?.profile_url || "logo.svg"}
              alt="User"
              className="w-8 h-8 rounded-full border-gray-400 border"
            />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.fullName || user?.name || "Loading..."}
            </span>
          </div>
          {showProfile && (
            <UserProfile
              profile={user}
              onAddAdminClick={() => {
                setIsModalOpen(true), setShowProfile(false);
              }}
            />
          )}
        </div>
      </div>
      {/* Admin-only modal */}
      {user?.role === "SUPERADMIN" && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
        >
          <AddAdminForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;