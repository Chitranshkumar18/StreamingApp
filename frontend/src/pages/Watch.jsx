import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ThumbsUp,
  Share2,
  BookmarkPlus,
  Play,
  Check,
  UserCheck,
  UserPlus,
} from "lucide-react";
import CommentSection from "../components/CommentSection";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../api/api";

export default function Watch() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [currentVideo, setCurrentVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load video details and related videos
  useEffect(() => {
    if (!videoId) return;

    const fetchVideoData = async () => {
      setIsLoading(true);
      try {
        // Fetch current video
        const videoRes = await fetch(ENDPOINTS.VIDEOS.GET_BY_ID(videoId), {
          credentials: "include",
        });
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          const vid = videoData?.data;
          setCurrentVideo(vid);

          // If authenticated, add video to watch history
          if (isAuthenticated) {
            try {
              await fetch(ENDPOINTS.AUTH.ADD_TO_WATCH_HISTORY(videoId), {
                method: "POST",
                credentials: "include",
              });
            } catch (err) {
              console.error("Failed to add to watch history:", err);
            }
          }

          // If authenticated and owner is available, check subscribed or liked
          if (isAuthenticated && vid?.owner?._id) {
            try {
              const subRes = await fetch(
                ENDPOINTS.SUBSCRIPTIONS.GET_SUBSCRIBED_CHANNELS(vid.owner._id),
                { credentials: "include" }
              );
              if (subRes.ok) {
                const subData = await subRes.json();
                const isSub = (subData?.data || []).some(
                  (s) =>
                    s.channel?._id === vid.owner._id ||
                    s.channel === vid.owner._id
                );
                setIsSubscribed(isSub);
              }
            } catch (e) {
              // Ignore
            }
          }
        }

        // Fetch comments
        const commentsRes = await fetch(
          ENDPOINTS.COMMENTS.GET_VIDEO_COMMENTS(videoId),
          {
            credentials: "include",
          }
        );
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData?.data || []);
        }

        // Fetch related videos
        const relatedRes = await fetch(ENDPOINTS.VIDEOS.GET_ALL, {
          credentials: "include",
        });
        if (relatedRes.ok) {
          const relData = await relatedRes.json();
          const allVids = Array.isArray(relData?.data)
            ? relData.data
            : relData?.data?.videos || [];
          setRelatedVideos(allVids.filter((v) => v._id !== videoId));
        }

        // Check if video is liked if authenticated
        if (isAuthenticated) {
          try {
            const likedRes = await fetch(ENDPOINTS.LIKES.GET_LIKED_VIDEOS, {
              credentials: "include",
            });
            if (likedRes.ok) {
              const likedData = await likedRes.json();
              const likedList = likedData?.data || [];
              const isVideoLiked = likedList.some(
                (item) => (item.video?._id || item.video || item._id) === videoId
              );
              setIsLiked(isVideoLiked);
            }
          } catch (e) {
            // Ignore
          }
        }
      } catch (err) {
        console.error("Failed to load video details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId, isAuthenticated]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    const channelId = currentVideo?.owner?._id || currentVideo?.owner;
    if (!channelId) return;

    try {
      const res = await fetch(ENDPOINTS.SUBSCRIPTIONS.TOGGLE(channelId), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setIsSubscribed((prev) => !prev);
      }
    } catch (err) {
      console.error("Failed to toggle subscription:", err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    try {
      const res = await fetch(ENDPOINTS.LIKES.TOGGLE_VIDEO_LIKE(videoId), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setIsLiked((prev) => !prev);
      }
    } catch (err) {
      console.error("Failed to toggle video like:", err);
    }
  };

  const handleAddComment = async (content) => {
    if (!content.trim()) return;
    try {
      const res = await fetch(ENDPOINTS.COMMENTS.ADD_COMMENT(videoId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const json = await res.json();
        const newComment = json.data;
        // ensure owner information is attached
        if (!newComment.owner && user) {
          newComment.owner = user;
        }
        setComments((prev) => [newComment, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    if (!content.trim()) return;
    try {
      const res = await fetch(ENDPOINTS.COMMENTS.UPDATE_COMMENT(commentId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, content } : c))
        );
      }
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(ENDPOINTS.COMMENTS.DELETE_COMMENT(commentId), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    try {
      const res = await fetch(ENDPOINTS.LIKES.TOGGLE_COMMENT_LIKE(commentId), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        // Increment or toggle like indicator
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likesCount: (c.likesCount || 0) + 1 }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
    }
  };

  const handleSaveToPlaylist = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate(`/login?redirect=${encodeURIComponent("/playlists")}`);
    }
  };

  const title = currentVideo?.title || "Video Player";
  const videoSrc = currentVideo?.videoFile;
  const thumbnail = currentVideo?.thumbnail;
  const description = currentVideo?.description || "No description provided for this video.";
  const views = currentVideo?.views !== undefined ? currentVideo.views : "--";
  const createdAt = currentVideo?.createdAt ? new Date(currentVideo.createdAt).toLocaleDateString() : "--";
  const ownerName = currentVideo?.owner?.fullName || currentVideo?.owner?.username || "Channel Creator";
  const ownerAvatar = currentVideo?.owner?.avatar;
  const ownerHandle = currentVideo?.owner?.username ? `@${currentVideo.owner.username}` : "@creator";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      {/* Left / Main Column: Player + Details + Comments */}
      <div className="lg:col-span-8 space-y-5">
        {/* Video Player Area */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center group">
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={thumbnail}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20 p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-xl">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <p className="text-slate-200 font-semibold text-sm">
                {isLoading ? "Loading stream..." : "Video not available"}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {isLoading ? "Please wait while the media stream loads" : "The requested video could not be loaded"}
              </p>
            </div>
          )}
        </div>

        {/* Video Title */}
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          {title}
        </h1>

        {/* Channel Info & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Channel Owner */}
          <div className="flex items-center gap-3">
            {ownerAvatar ? (
              <img
                src={ownerAvatar}
                alt={ownerName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {ownerName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-100 text-sm">{ownerName}</h3>
              <p className="text-xs text-slate-400">{ownerHandle}</p>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className={`ml-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSubscribed
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/20"
              }`}
            >
              {isSubscribed ? (
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Subscribed
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  Subscribe
                </span>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isLiked
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>

            {/* Save to playlist */}
            <Link
              to="/playlists"
              onClick={handleSaveToPlaylist}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save</span>
            </Link>
          </div>
        </div>

        {/* Video Description Box */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-3 text-slate-400 font-medium">
            <span>{typeof views === "number" ? `${views} views` : `${views} views`}</span>
            <span>•</span>
            <span>{createdAt}</span>
          </div>

          <p className={`leading-relaxed whitespace-pre-line ${!isDescExpanded && "line-clamp-2"}`}>
            {description}
          </p>

          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer block pt-1"
          >
            {isDescExpanded ? "Show less" : "Show more"}
          </button>
        </div>

        {/* Comments Section */}
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onToggleLike={handleToggleCommentLike}
        />
      </div>

      {/* Right Column: Up Next / Related Videos */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-base font-semibold text-slate-100">Related Videos</h3>
        <div className="space-y-3">
          {relatedVideos.length > 0 ? (
            relatedVideos.map((video) => (
              <VideoCard key={video._id} video={video} variant="compact" />
            ))
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              No related videos available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
