import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Compass, Flame, LayoutGrid, Filter, Film } from "lucide-react";
import VideoCard from "../components/VideoCard";
import EmptyState from "../components/EmptyState";
import { ENDPOINTS } from "../api/api";

const CATEGORIES = [
  "All",
  "Music",
  "Gaming",
  "Education",
  "Tech",
  "Entertainment",
  "News",
  "Sports",
  "Podcasts",
];

export default function Browse() {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
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
      } catch (err) {
        console.error("Failed to fetch videos in Browse:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter & sort videos
  let displayedVideos = [...videos];

  if (selectedCategory !== "All") {
    displayedVideos = displayedVideos.filter((video) => {
      const matchCategory = video.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchTitle = video.title?.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchDesc = video.description?.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchCategory || matchTitle || matchDesc;
    });
  }

  if (sortBy === "views") {
    displayedVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sortBy === "oldest") {
    displayedVideos.sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
  } else {
    displayedVideos.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            {currentTab === "trending" ? (
              <>
                <Flame className="w-6 h-6 text-amber-500" />
                <span>Trending Videos</span>
              </>
            ) : currentTab === "categories" ? (
              <>
                <LayoutGrid className="w-6 h-6 text-indigo-400" />
                <span>Browse Categories</span>
              </>
            ) : (
              <>
                <Compass className="w-6 h-6 text-indigo-400" />
                <span>Explore & Browse</span>
              </>
            )}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Discover latest releases and trending content from across the platform.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500"
          >
            <option value="latest">Latest First</option>
            <option value="views">Most Viewed</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid or Empty State */}
      {displayedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Film}
          title={isLoading ? "Loading videos..." : "No videos found"}
          description={
            isLoading
              ? "Fetching videos from the database..."
              : selectedCategory !== "All"
              ? `No videos found in the "${selectedCategory}" category.`
              : "No videos are available on the platform right now."
          }
        />
      )}
    </div>
  );
}
