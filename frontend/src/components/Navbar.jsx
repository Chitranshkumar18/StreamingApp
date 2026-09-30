import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Upload,
  User,
  LayoutDashboard,
  FolderUp,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent("/upload")}`);
    } else {
      navigate("/upload");
    }
  };

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[#080c16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Brand Logo for Small Screens */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 lg:hidden transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo visible on mobile / tablet */}
        <Link to="/" className="flex items-center gap-2.5 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg
              className="w-5 h-5 text-white fill-current ml-0.5"
              viewBox="0 0 24 24"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos, creators, or anything..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800/90 text-slate-100 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          title="Upload Video"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Upload</span>
        </button>

        {/* Notifications (Only for authenticated users) */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-11 w-72 md:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Notifications
                    </h4>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400 py-2">
                    <div className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <p className="text-slate-200 font-medium">Welcome to the Platform</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Explore trending videos, playlists, and community posts.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Authenticated User Menu vs Guest Login/Register */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || user.username || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-md shadow-indigo-600/30">
                  {userInitials}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-11 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-30 text-xs text-slate-300">
                  <div className="px-4 py-2 border-b border-slate-800 mb-1">
                    <p className="font-semibold text-slate-100 truncate">
                      {user?.fullName || user?.username || "User"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.email || (user?.username ? `@${user.username}` : "")}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Your Channel Profile
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Creator Dashboard
                  </Link>

                  <Link
                    to="/my-uploads"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <FolderUp className="w-4 h-4 text-slate-400" />
                    My Uploads
                  </Link>

                  <Link
                    to="/upload"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    Upload Video
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-slate-200 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </Link>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-500/10 text-rose-400 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
