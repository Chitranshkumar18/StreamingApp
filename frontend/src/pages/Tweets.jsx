import React, { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Send, Trash2, Edit, X } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../api/api";

export default function Tweets() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchTweets = async () => {
    setIsLoading(true);
    try {
      const userId = user?._id || "me";
      const res = await fetch(ENDPOINTS.TWEETS.GET_USER_TWEETS(userId), {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setTweets(data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch(ENDPOINTS.TWEETS.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        const newTweet = data?.data;
        if (newTweet) {
          if (!newTweet.owner && user) {
            newTweet.owner = user;
          }
          setTweets((prev) => [newTweet, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to create tweet:", err);
    }

    setContent("");
  };

  const handleStartEdit = (tweet) => {
    setEditingTweetId(tweet._id);
    setEditContent(tweet.content || "");
  };

  const handleSaveEdit = async (tweetId) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(ENDPOINTS.TWEETS.UPDATE(tweetId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (res.ok) {
        setTweets((prev) =>
          prev.map((t) =>
            t._id === tweetId ? { ...t, content: editContent.trim() } : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to update tweet:", err);
    }

    setEditingTweetId(null);
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(ENDPOINTS.TWEETS.DELETE(tweetId), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTweets((prev) => prev.filter((t) => t._id !== tweetId));
      }
    } catch (err) {
      console.error("Failed to delete tweet:", err);
    }
  };

  const handleToggleLike = async (tweetId) => {
    try {
      const res = await fetch(ENDPOINTS.LIKES.TOGGLE_TWEET_LIKE(tweetId), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setTweets((prev) =>
          prev.map((t) =>
            t._id === tweetId
              ? { ...t, likesCount: (t.likesCount || 0) + 1 }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle tweet like:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Community Posts</h1>
            <p className="text-xs text-slate-400">
              Share updates, thoughts, and announcements with your audience
            </p>
          </div>
        </div>
      </div>

      {/* Create Tweet Form */}
      <form
        onSubmit={handleCreate}
        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
      >
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in your community? Share an update..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
        />
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">
            {content.length} / 500 characters
          </span>
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Update</span>
          </button>
        </div>
      </form>

      {/* Tweet Feed or Empty State */}
      {tweets.length > 0 ? (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
            >
              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tweet.owner?.avatar ? (
                    <img
                      src={tweet.owner.avatar}
                      alt={tweet.owner.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {tweet.owner?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      {tweet.owner?.fullName || tweet.owner?.username || "Creator"}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {tweet.createdAt ? new Date(tweet.createdAt).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(tweet)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTweet(tweet._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tweet Content */}
              {editingTweetId === tweet._id ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(tweet._id)}
                      className="px-3 py-1 bg-indigo-600 rounded-lg text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTweetId(null)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {tweet.content}
                </p>
              )}

              {/* Tweet Actions */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <button
                  onClick={() => handleToggleLike(tweet._id)}
                  className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{tweet.likesCount || 0} Likes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No community posts yet"
          description="Create your first post above to share updates with your followers."
        />
      )}
    </div>
  );
}
