import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { agencyRouteMap, retailerRouteMap, adminRouteMap } from "../routes/routeMaps";
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const profileRef = useRef();
  const searchWrapperRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.role) return;
    const isAdmin = ["SUPERADMIN", "ADMIN"].includes(user.role);
    dispatch(isAdmin ? fetchAdminProfile() : fetchUserProfile());
  }, [dispatch, user?.role]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setQuery("");
        setResult([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableRoutes = useMemo(() => {
    if (!user?.role) return [];
    if (["SUPERADMIN", "ADMIN"].includes(user.role)) return adminRouteMap;
    if (user.role === "Retailer") return retailerRouteMap;
    if (user.role === "Ad-Agency") return agencyRouteMap;
    return [];
  }, [user?.role]);

  const handleSearch = (value) => {
    setQuery(value);
    setActiveIndex(-1);
    if (!value.trim()) { setResult([]); return; }
    const searchTerm = value.toLowerCase();
    const filtered = availableRoutes.filter((route) => {
      const inName = route.name?.toLowerCase().includes(searchTerm);
      const inKeywords = route.keywords?.some((kw) => kw.toLowerCase().includes(searchTerm));
      return inName || inKeywords;
    });
    setResult(filtered);
  };

  const handleKeyDown = (e) => {
    if (!result.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, result.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Escape") {
      setQuery(""); setResult([]); setActiveIndex(-1);
    }
  };

  const clearSearch = () => { setQuery(""); setResult([]); setActiveIndex(-1); };

  // Highlight matched text
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[#4684ff] font-semibold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="h-20 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: Sidebar toggle + Global Search */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button className="md:hidden text-xl text-gray-500 hover:text-gray-800 transition-colors" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Global Search wrapper */}
        <div ref={searchWrapperRef} className="relative flex-1">
          <SearchBar
            value={query}
            onChange={handleSearch}
            onClear={clearSearch}
            placeholder="Search pages..."
            inputProps={{ onKeyDown: handleKeyDown, "aria-label": "Global search", "aria-expanded": result.length > 0 || (query && result.length === 0), role: "combobox" }}
          />

          {/* Dropdown */}
          {query && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-slideDown">
              {result.length > 0 ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#4684ff] uppercase tracking-wider">
                      {result.length} result{result.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-gray-300 hidden sm:flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400 font-mono text-[10px]">↑↓</kbd>
                      <span>navigate</span>
                      <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-400 font-mono text-[10px]">Esc</kbd>
                      <span>close</span>
                    </span>
                  </div>
                  <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
                    {result.map((item, index) => (
                      <li key={index} role="option" aria-selected={activeIndex === index}>
                        <Link
                          to={item.path}
                          onClick={clearSearch}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150
                            ${activeIndex === index
                              ? "bg-[#4684ff]/8 text-[#4684ff]"
                              : "text-gray-700 hover:bg-[#4684ff]/5 hover:text-[#4684ff]"
                            }
                          `}
                        >
                          {/* Page icon */}
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors
                            ${activeIndex === index ? "bg-[#4684ff] text-white" : "bg-[#4684ff]/10 text-[#4684ff]"}`}>
                            {item.name?.[0]?.toUpperCase()}
                          </span>
                          <span className="flex-1 font-medium">
                            {highlightMatch(item.name, query)}
                          </span>
                          {/* Arrow */}
                          <svg className={`w-3.5 h-3.5 transition-opacity ${activeIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">No results for <span className="text-gray-700">"{query}"</span></p>
                  <p className="text-xs text-gray-400">Try a different keyword</p>
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
          className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:border-[#4684ff] transition-colors cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile((prev) => !prev)}
            className="cursor-pointer flex items-center gap-2.5 px-3 py-2 bg-gradient-to-r from-[#578bf2] to-[#497df6] rounded-xl hover:from-[#3a6fe6] hover:to-[#2d5acc] hover:shadow-lg transition-all duration-200"
          >
            <img
              src={user?.avatar || user?.profile_url || "logo.svg"}
              alt="User"
              className="w-8 h-8 rounded-full border-3 border-white object-cover shadow-sm"
            />
            <span className="text-sm font-semibold text-white hidden sm:block">
              {user?.fullName || user?.name || "Loading..."}
            </span>
            <svg className={`w-4 h-4 text-white/90 hidden sm:block transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showProfile && (
            <UserProfile
              profile={user}
              onAddAdminClick={() => { setIsModalOpen(true); setShowProfile(false); }}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </div>

      {/* Admin-only modal */}
      {user?.role === "SUPERADMIN" && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
          <AddAdminForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Navbar;