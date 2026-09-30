import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Globe,
  Lock,
  Play,
  X,
} from "lucide-react";
import EmptyState from "../components/EmptyState";

export default function MyUploads({
  videos = [],
  onTogglePublish,
  onDeleteVideo,
  onUpdateVideo,
}) {
  const [editingVideo, setEditingVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleStartEdit = (video) => {
    setEditingVideo(video);
    setTitle(video.title || "");
    setDescription(video.description || "");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (onUpdateVideo && editingVideo) {
      onUpdateVideo(editingVideo._id, { title, description });
    }
    setEditingVideo(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FolderUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Uploads</h1>
            <p className="text-xs text-slate-400">
              Manage your channel videos, visibility, and details
            </p>
          </div>
        </div>

        <Link
          to="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* Videos List */}
      {videos.length > 0 ? (
        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
            >
              {/* Left Video Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-28 sm:w-36 aspect-video rounded-xl bg-slate-800 shrink-0 overflow-hidden relative border border-slate-700">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Play className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <Link
                    to={`/watch/${video._id}`}
                    className="text-sm font-semibold text-slate-100 hover:text-indigo-400 line-clamp-1"
                  >
                    {video.title || "Untitled Video"}
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {video.description || "No description"}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views ?? 0} views
                    </span>
                    <span>•</span>
                    <span>
                      {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : "--"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Status & Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {/* Publish Toggle */}
                <button
                  onClick={() => onTogglePublish && onTogglePublish(video._id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    video.isPublished
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {video.isPublished ? (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unpublished</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleStartEdit(video)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit video"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteVideo && onDeleteVideo(video._id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderUp}
          title="No videos uploaded yet"
          description="Start building your channel by uploading your very first video."
          actionText="Upload Video"
          actionLink="/upload"
        />
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Edit Video Details</h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
