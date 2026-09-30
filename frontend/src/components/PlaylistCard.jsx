import React from "react";
import { Link } from "react-router-dom";
import { ListMusic, Play, MoreVertical, Trash2, Edit } from "lucide-react";

export default function PlaylistCard({ playlist, onDelete, onEdit }) {
  const id = playlist?._id || "preview";
  const name = playlist?.name || "Untitled Playlist";
  const description = playlist?.description || "";
  const videoCount = playlist?.videos?.length ?? playlist?.totalVideos ?? 0;

  return (
    <div className="group flex flex-col bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-3 transition-all duration-300">
      {/* Visual Playlist Cover */}
      <Link
        to={`/playlist/${id}`}
        className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-[1.02] transition-transform"
      >
        <div className="flex flex-col items-center gap-2 text-indigo-400">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg">
            <ListMusic className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-slate-300">
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </span>
        </div>

        {/* Stack overlay badge at right */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-black/40 backdrop-blur-xs border-l border-white/10 flex flex-col items-center justify-center gap-1 text-slate-300 text-xs">
          <Play className="w-4 h-4 fill-current" />
        </div>
      </Link>

      {/* Playlist Meta */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            to={`/playlist/${id}`}
            className="text-sm font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1"
          >
            {name}
          </Link>
          {description && (
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {description}
            </p>
          )}
          <span className="text-[11px] text-slate-400 block mt-1">
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </span>
        </div>

        {/* Quick action buttons if handlers passed */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(playlist)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Edit Playlist"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Delete Playlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
