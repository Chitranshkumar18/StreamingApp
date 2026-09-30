import React, { useState, useEffect } from "react";
import { Clock, Trash2 } from "lucide-react";
import VideoCard from "../components/VideoCard";
import EmptyState from "../components/EmptyState";
import { ENDPOINTS } from "../api/api";

export default function History() {
  const [historyVideos, setHistoryVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.AUTH.WATCH_HISTORY, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setHistoryVideos(data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = () => {
    setHistoryVideos([]);
  };
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Watch History</h1>
            <p className="text-xs text-slate-400">Videos you have watched recently</p>
          </div>
        </div>

        {historyVideos.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Content */}
      {historyVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {historyVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Clock}
          title="Your watch history is empty"
          description="Videos you watch will show up here. Start discovering videos on the home page."
          actionText="Explore Home"
          actionLink="/"
        />
      )}
    </div>
  );
}
