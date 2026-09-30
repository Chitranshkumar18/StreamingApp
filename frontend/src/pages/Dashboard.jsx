import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Eye,
  Users,
  ThumbsUp,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import EmptyState from "../components/EmptyState";
import { ENDPOINTS } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, videosRes] = await Promise.all([
          fetch(ENDPOINTS.DASHBOARD.GET_STATS, { credentials: "include" }),
          fetch(ENDPOINTS.DASHBOARD.GET_VIDEOS, { credentials: "include" }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData?.data || null);
        }

        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData?.data || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalVideos = stats?.totalVideos !== undefined ? stats.totalVideos : (isLoading ? "--" : 0);
  const totalViews = stats?.totalViews !== undefined ? stats.totalViews : (isLoading ? "--" : 0);
  const totalSubscribers = stats?.totalSubscribers !== undefined ? stats.totalSubscribers : (isLoading ? "--" : 0);
  const totalLikes = stats?.totalLikes !== undefined ? stats.totalLikes : (isLoading ? "--" : 0);

  const statCards = [
    {
      title: "Total Videos",
      value: totalVideos,
      icon: Film,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Subscribers",
      value: totalSubscribers,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Total Likes",
      value: totalLikes,
      icon: ThumbsUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Channel Dashboard</h1>
            <p className="text-xs text-slate-400">
              Overview of your channel performance and uploads
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between shadow-lg"
            >
              <div>
                <p className="text-xs font-medium text-slate-400">{card.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {card.value}
                </h3>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl ${card.bg} border flex items-center justify-center ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Channel Videos Table / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Uploads</h2>
          <Link
            to="/my-uploads"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Manage All Videos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Video</th>
                  <th className="px-4 py-3">Visibility</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {videos.map((video) => (
                  <tr key={video._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-100 flex items-center gap-3">
                      <div className="w-16 aspect-video bg-slate-800 rounded-lg overflow-hidden shrink-0">
                        {video.thumbnail && (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="line-clamp-1">{video.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          video.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{video.views ?? 0}</td>
                    <td className="px-4 py-3">
                      {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Film}
            title="No channel videos found"
            description="Your uploaded videos will appear in this table once uploaded."
            actionText="Upload First Video"
            actionLink="/upload"
          />
        )}
      </div>
    </div>
  );
}
