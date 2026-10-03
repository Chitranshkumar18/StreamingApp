import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Tv,
  Clock,
  ThumbsUp,
  ListMusic,
  FolderUp,
  Plus,
  Settings,
  ChevronRight,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: "Home", path: "/", icon: Home, isPublic: true },
    { label: "Subscriptions", path: "/subscriptions", icon: Tv, isPublic: false },
    { label: "History", path: "/history", icon: Clock, isPublic: false },
    { label: "Liked Videos", path: "/liked-videos", icon: ThumbsUp, isPublic: false },
    { label: "Playlists", path: "/playlists", icon: ListMusic, isPublic: false },
    { label: "My Uploads", path: "/my-uploads", icon: FolderUp, isPublic: false },
    { label: "Community", path: "/tweets", icon: MessageSquare, isPublic: false },
  ];

  const handleNavClick = (e, path, isPublic) => {
    onClose();
    if (!isPublic && !isAuthenticated) {
      e.preventDefault();
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  const handleCreatePlaylistClick = (e) => {
    onClose();
    if (!isAuthenticated) {
      e.preventDefault();
      navigate(`/login?redirect=${encodeURIComponent("/playlists")}`);
    } else {
      navigate("/playlists");
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#080c16] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/60 shrink-0">
          <Link to="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <svg
                className="w-5 h-5 text-white fill-current ml-0.5"
                viewBox="0 0 24 24"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              StreamVibe
            </span>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path, item.isPublic)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Your Playlists Section */}
          <div>
            <div className="flex items-center justify-between px-3.5 mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Playlists
              </h4>
            </div>

            <button
              onClick={handleCreatePlaylistClick}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50 transition-colors mb-2 cursor-pointer text-left"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Playlist</span>
            </button>

            {/* Quick Playlists Navigation */}
            <div className="space-y-1 px-1">
              <Link
                to="/playlists"
                onClick={(e) => handleNavClick(e, "/playlists", false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
              >
                <span>View All Playlists</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Creator Dashboard & Settings */}
        <div className="p-4 border-t border-slate-800/80 space-y-1 shrink-0 bg-[#080c16]">
          <Link
            to="/dashboard"
            onClick={(e) => handleNavClick(e, "/dashboard", false)}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-slate-800 text-indigo-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Creator Dashboard</span>
          </Link>
          <Link
            to="/settings"
            onClick={(e) => handleNavClick(e, "/settings", false)}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive("/settings")
                ? "bg-slate-800 text-indigo-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
