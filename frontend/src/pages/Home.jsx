import React from "react";
import { Link } from "react-router-dom";
import { Play, Flame, Clock, ThumbsUp, ArrowRight, Compass, Sparkles } from "lucide-react";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";

export default function Home({
  trendingVideos = [],
  historyVideos = [],
  likedVideos = [],
}) {
  const { user, isAuthenticated } = useAuth();
  const placeholderTrendingCount = 5;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section Banner */}
      <section className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-[#0b101e] via-[#0f172a] to-[#121b33] p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAuthenticated && user?.fullName ? `Welcome back, ${user.fullName}` : "Discover & Stream"}</span>
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Discover Something New
            </h1>

            <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
              Your next favorite video is just a click away. Explore curated streams, community posts, and high-quality creators.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Now</span>
              </Link>

              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-sm border border-slate-700/60 transition-all hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Browse</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Visual Area */}
          <div className="lg:col-span-5 h-44 md:h-56 rounded-2xl relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-slate-800/60 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent" />
            <div className="text-center relative z-10 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Featured Content & New Releases
              </p>
            </div>

            {/* Slide / Carousel Dots Indicator */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
              <span className="w-4 h-1.5 rounded-full bg-white transition-all" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Trending Now (Public) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Trending Now
            </h2>
          </div>
          <Link
            to="/browse?tab=trending"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5-column Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {trendingVideos.length > 0
            ? trendingVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))
            : Array.from({ length: placeholderTrendingCount }).map((_, idx) => (
                <VideoCard
                  key={`trending-placeholder-${idx}`}
                  title="Discover Upcoming Video"
                  category="Trending"
                />
              ))}
        </div>
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Featured Streams
            </h2>
          </div>
          <Link
            to="/browse"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <VideoCard
              key={`featured-stream-${idx}`}
              title="Featured Creator Stream"
              category="Recommended"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
