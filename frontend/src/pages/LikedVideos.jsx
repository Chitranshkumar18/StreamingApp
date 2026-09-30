import React, { useState, useEffect } from "react";
import { ThumbsUp, Play } from "lucide-react";
import VideoCard from "../components/VideoCard";
import EmptyState from "../components/EmptyState";
import { ENDPOINTS } from "../api/api";

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(ENDPOINTS.LIKES.GET_LIKED_VIDEOS, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const items = (data?.data || []).map((item) => item.video || item);
          setLikedVideos(items);
        }
      } catch (err) {
        console.error("Failed to fetch liked videos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Liked Videos</h1>
            <p className="text-xs text-slate-400">
              {likedVideos.length} {likedVideos.length === 1 ? "video" : "videos"} saved
            </p>
          </div>
        </div>

        {likedVideos.length > 0 && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play All</span>
          </button>
        )}
      </div>

      {/* Content */}
      {likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ThumbsUp}
          title="No liked videos yet"
          description="Click the thumbs-up button on any video to save it here for quick access."
          actionText="Discover Videos"
          actionLink="/browse"
        />
      )}
    </div>
  );
}
