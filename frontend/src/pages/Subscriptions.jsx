import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tv, UserCheck, Bell } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../api/api";

export default function Subscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const channelId = user?._id || "me";
      const res = await fetch(
        ENDPOINTS.SUBSCRIPTIONS.GET_SUBSCRIBED_CHANNELS(channelId),
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const handleToggleSubscription = async (channelId) => {
    try {
      const res = await fetch(ENDPOINTS.SUBSCRIPTIONS.TOGGLE(channelId), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setSubscriptions((prev) =>
          prev.filter((sub) => {
            const id = sub.channel?._id || sub.channel || sub._id;
            return id !== channelId;
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle subscription:", err);
    }
  };
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
            <p className="text-xs text-slate-400">Channels and creators you follow</p>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid or Empty State */}
      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subscriptions.map((sub) => {
            const channel = sub.channel || sub;
            return (
              <div
                key={channel._id || channel.username}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center hover:border-slate-700 transition-all"
              >
                {channel.avatar ? (
                  <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-indigo-500/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-lg">
                    {channel.fullName?.[0] || channel.username?.[0] || "C"}
                  </div>
                )}

                <h3 className="font-semibold text-slate-100 text-sm line-clamp-1">
                  {channel.fullName || channel.username || "Creator Channel"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 mb-4">
                  @{channel.username || "creator"}
                </p>

                <div className="flex items-center gap-2 w-full mt-auto">
                  <Link
                    to={`/profile`}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleToggleSubscription(channel._id)}
                    className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-medium border border-indigo-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Subscribed"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Subscribed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Tv}
          title="No subscriptions yet"
          description="Subscribe to your favorite creators to stay updated with their latest uploads."
          actionText="Discover Creators"
          actionLink="/"
        />
      )}
    </div>
  );
}
