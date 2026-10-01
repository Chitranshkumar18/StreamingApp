import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Flame, Clock, ThumbsUp, ArrowRight, Compass, Sparkles } from "lucide-react";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../api/api";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [historyVideos, setHistoryVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        // Fetch public videos
        const res = await fetch(ENDPOINTS.VIDEOS.GET_ALL, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const videoList = Array.isArray(data?.data)
            ? data.data
            : data?.data?.videos || [];
          setVideos(videoList);
        }

        // If authenticated, fetch history & liked videos
        if (isAuthenticated) {
          try {
            const histRes = await fetch(ENDPOINTS.AUTH.WATCH_HISTORY, {
              credentials: "include",
            });
            if (histRes.ok) {
              const histData = await histRes.json();
              setHistoryVideos(histData?.data || []);
            }
          } catch (e) {
            console.error("Failed to load history", e);
          }

          try {
            const likedRes = await fetch(ENDPOINTS.LIKES.GET_LIKED_VIDEOS, {
              credentials: "include",
            });
            if (likedRes.ok) {
              const likedData = await likedRes.json();
              const likedItems = (likedData?.data || []).map(
                (item) => item.video || item
              );
              setLikedVideos(likedItems);
            }
          } catch (e) {
            console.error("Failed to load liked videos", e);
          }
        }
      } catch (err) {
        console.error("Error fetching home videos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section Banner */}
      
      {/* Section 1: Trending Now (Public) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Trending Now
            </h2>
          </div>
        </div>

        {/* 5-column Video Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {videos.slice(0, 10).map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            {isLoading ? "Loading videos..." : "No videos uploaded to the platform yet. Be the first creator to upload a video!"}
          </div>
        )}
      </section>

      {/* Section 2: Continue Watching (Only for Authenticated Users with History) */}
      {isAuthenticated && historyVideos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                Continue Watching
              </h2>
            </div>
            <Link
              to="/history"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {historyVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Liked Videos (Only for Authenticated Users with Liked Videos) */}
      {isAuthenticated && likedVideos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                Liked Videos
              </h2>
            </div>
            <Link
              to="/liked-videos"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {likedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      )}

      {/* Section 4: Recommended Streams (Public Discovery) */}
      {videos.length > 5 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                Featured Streams
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {videos.slice(5, 13).map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
