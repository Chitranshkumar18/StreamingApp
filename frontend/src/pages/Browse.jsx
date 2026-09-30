import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Compass, Flame, LayoutGrid, Filter } from "lucide-react";
import VideoCard from "../components/VideoCard";

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

export default function Browse({ videos = [] }) {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

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

      {/* Video Grid or Placeholder Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <VideoCard
              key={`browse-placeholder-${idx}`}
              title="Stream Video"
              category={selectedCategory === "All" ? "Featured" : selectedCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
