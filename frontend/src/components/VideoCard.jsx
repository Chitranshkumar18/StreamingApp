import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical, Play, Clock, Share2, BookmarkPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Helper to format video duration in mm:ss or hh:mm:ss
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return null;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Helper to format view numbers
const formatViews = (views) => {
  if (views === undefined || views === null) return null;
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
};

// Helper to format time ago
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  const diffInSec = Math.floor((now - date) / 1000);

  if (diffInSec < 60) return "Just now";
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
  if (diffInSec < 2592000) return `${Math.floor(diffInSec / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function VideoCard({
  video,
  thumbnail,
  title,
  duration,
  views,
  owner,
  createdAt,
  videoId,
  category,
  variant = "default", // default | compact | wide
}) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Extract from video object if provided, otherwise fallback to individual props
  const id = video?._id || videoId || "preview";
  const displayTitle = video?.title || title || "Untitled Video";
  const displayThumbnail = video?.thumbnail || thumbnail;
  const displayDuration = formatDuration(video?.duration ?? duration);
  const displayViews = formatViews(video?.views ?? views);
  const displayDate = formatTimeAgo(video?.createdAt ?? createdAt);
  const displayOwner = video?.owner?.username || video?.owner?.fullName || owner?.username || (typeof owner === "string" ? owner : null);
  const displayCategory = category || video?.category;

  const handleSaveToPlaylist = () => {
    setShowMenu(false);
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent("/playlists")}`);
      return;
    }
    navigate(`/playlists`);
  };

  const handleWatchLater = () => {
    setShowMenu(false);
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent("/history")}`);
      return;
    }
    navigate(`/history`);
  };

  const handleShare = () => {
    setShowMenu(false);
    navigator.clipboard?.writeText(`${window.location.origin}/watch/${id}`);
  };

  return (
    <div className={`group flex flex-col relative ${variant === "wide" ? "w-full" : ""}`}>
      {/* Thumbnail Area */}
      <Link
        to={`/watch/${id}`}
        className="relative block w-full aspect-video rounded-xl overflow-hidden bg-slate-900/80 border border-slate-800/80 group-hover:border-slate-700/80 transition-all duration-300"
      >
        {displayThumbnail ? (
          <img
            src={displayThumbnail}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800/60 to-slate-950 p-4">
            <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/50 transition-all shadow-md">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        {displayDuration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-medium text-slate-200 border border-white/10">
            {displayDuration}
          </span>
        )}
      </Link>

      {/* Info Section */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link
            to={`/watch/${id}`}
            title={displayTitle}
            className="text-sm font-medium text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 block"
          >
            {displayTitle}
          </Link>

          <div className="mt-1 flex items-center flex-wrap gap-x-1.5 text-xs text-slate-400">
            {displayOwner && (
              <span className="hover:text-slate-300 transition-colors">
                {displayOwner}
              </span>
            )}
            {displayCategory && (
              <>
                {displayOwner && <span>•</span>}
                <span>{displayCategory}</span>
              </>
            )}
            {displayViews && (
              <>
                {(displayOwner || displayCategory) && <span>•</span>}
                <span>{displayViews}</span>
              </>
            )}
            {displayDate && (
              <>
                {(displayOwner || displayCategory || displayViews) && <span>•</span>}
                <span>{displayDate}</span>
              </>
            )}
          </div>
        </div>

        {/* 3-dots Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-30 text-xs text-slate-300">
                <button
                  onClick={handleSaveToPlaylist}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-slate-400" />
                  Save to Playlist
                </button>
                <button
                  onClick={handleWatchLater}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Save to Watch Later
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  Share Video
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
