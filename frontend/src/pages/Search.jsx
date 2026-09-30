import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter } from "lucide-react";
import VideoCard from "../components/VideoCard";
import EmptyState from "../components/EmptyState";

export default function Search({ searchResults = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header */}
      <div className="border-b border-slate-800 pb-5">
        <form onSubmit={handleSearch} className="max-w-xl flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search videos, tags, channels..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        {query && (
          <p className="text-xs text-slate-400 mt-3">
            Showing results for: <span className="text-slate-200 font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {/* Results */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : query ? (
        <EmptyState
          icon={SearchIcon}
          title="No results found"
          description={`We couldn't find any videos matching "${query}". Try searching with different keywords.`}
        />
      ) : (
        <EmptyState
          icon={SearchIcon}
          title="Search Videos"
          description="Type in a search query above to explore videos and creators."
        />
      )}
    </div>
  );
}
