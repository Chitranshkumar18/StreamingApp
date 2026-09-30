import React, { useState, useEffect } from "react";
import { ListMusic, Plus, X } from "lucide-react";
import PlaylistCard from "../components/PlaylistCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../api/api";

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const userId = user?._id || "me";
      const res = await fetch(ENDPOINTS.PLAYLISTS.GET_USER_PLAYLISTS(userId), {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch(ENDPOINTS.PLAYLISTS.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setPlaylists((prev) => [data.data, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }

    setName("");
    setDescription("");
    setShowModal(false);
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const res = await fetch(ENDPOINTS.PLAYLISTS.DELETE(playlistId), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  const handleEditPlaylist = async (playlistId, updatedData) => {
    try {
      const res = await fetch(ENDPOINTS.PLAYLISTS.UPDATE(playlistId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setPlaylists((prev) =>
          prev.map((p) => (p._id === playlistId ? { ...p, ...updatedData } : p))
        );
      }
    } catch (err) {
      console.error("Failed to update playlist:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ListMusic className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Playlists</h1>
            <p className="text-xs text-slate-400">Organize and collect your favorite videos</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Playlist Grid or Empty State */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              onDelete={handleDeletePlaylist}
              onEdit={handleEditPlaylist}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListMusic}
          title="No playlists created"
          description="Create custom playlists to group and save videos you love."
          actionText="Create Your First Playlist"
          onAction={() => setShowModal(true)}
        />
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Create New Playlist</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chill Vibes, Best Tech, Study Beats"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell others what this playlist is about..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
