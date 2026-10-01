import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ListMusic, Play, Trash2, Edit, ArrowLeft } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { ENDPOINTS } from "../api/api";

export default function PlaylistDetails() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchPlaylist = async () => {
    if (!playlistId) return;
    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.PLAYLISTS.GET_BY_ID(playlistId), {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const pl = data?.data;
        setPlaylist(pl);
        setName(pl?.name || "");
        setDescription(pl?.description || "");
      }
    } catch (err) {
      console.error("Failed to load playlist:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(ENDPOINTS.PLAYLISTS.UPDATE(playlistId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setPlaylist((prev) => (prev ? { ...prev, name, description } : prev));
      }
    } catch (err) {
      console.error("Failed to update playlist:", err);
    }
    setIsEditing(false);
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const res = await fetch(ENDPOINTS.PLAYLISTS.DELETE(playlistId), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/playlists");
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      const res = await fetch(
        ENDPOINTS.PLAYLISTS.REMOVE_VIDEO(videoId, playlistId),
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (res.ok) {
        setPlaylist((prev) =>
          prev
            ? {
                ...prev,
                videos: (prev.videos || []).filter((v) => v._id !== videoId),
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Failed to remove video from playlist:", err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <Link
        to="/playlists"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Playlists</span>
      </Link>

      {/* Playlist Hero / Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        {/* Playlist Cover Icon / Placeholder */}
        <div className="lg:col-span-4 aspect-video rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-950/60 border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center shadow-xl">
          <ListMusic className="w-12 h-12 text-indigo-400 mb-2" />
          <span className="text-sm font-semibold text-slate-200">
            {videos.length} {videos.length === 1 ? "Video" : "Videos"}
          </span>
        </div>

        {/* Playlist Meta & Actions */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-lg font-bold text-white"
                />
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  {name}
                </h1>
                <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed">
                  {description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 font-medium">
                  <span>Created by {playlist?.owner?.username || "You"}</span>
                  <span>•</span>
                  <span>{videos.length} videos</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-slate-800">
            {videos.length > 0 && (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play All</span>
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit Playlist</span>
            </button>

            <button
              onClick={handleDeletePlaylist}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Playlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video List inside Playlist */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Playlist Videos</h2>

        {videos.length > 0 ? (
          <div className="space-y-3">
            {videos.map((video, idx) => (
              <div
                key={video._id || idx}
                className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-400 w-5 text-center">
                    {idx + 1}
                  </span>
                  <div className="w-32 aspect-video rounded-xl bg-slate-800 shrink-0 overflow-hidden relative border border-slate-700">
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
                      {video.title || "Video Title"}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {video.owner?.username || "Creator"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove from playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ListMusic}
            title="Playlist is empty"
            description="No videos have been added to this playlist yet. Add videos while watching to build your collection."
            actionText="Discover Videos"
            actionLink="/"
          />
        )}
      </div>
    </div>
  );
}
