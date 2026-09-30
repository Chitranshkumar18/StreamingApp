import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThumbsUp, MessageSquare, MoreVertical, Edit2, Trash2, Send, User } from "lucide-react";
import EmptyState from "./EmptyState";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({
  comments = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onToggleLike,
}) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleRequireAuth = () => {
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      handleRequireAuth();
      return;
    }
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(commentText);
    }
    setCommentText("");
  };

  const handleStartEdit = (comment) => {
    if (!isAuthenticated) {
      handleRequireAuth();
      return;
    }
    setEditingCommentId(comment._id);
    setEditText(comment.content || "");
  };

  const handleSaveEdit = (commentId) => {
    if (!isAuthenticated) {
      handleRequireAuth();
      return;
    }
    if (!editText.trim()) return;
    if (onUpdateComment) {
      onUpdateComment(commentId, editText);
    }
    setEditingCommentId(null);
  };

  const handleDelete = (commentId) => {
    if (!isAuthenticated) {
      handleRequireAuth();
      return;
    }
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
  };

  const handleLike = (commentId) => {
    if (!isAuthenticated) {
      handleRequireAuth();
      return;
    }
    if (onToggleLike) {
      onToggleLike(commentId);
    }
  };

  const userInitial = user?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U";

  return (
    <div className="mt-8 border-t border-slate-800/80 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-lg font-semibold text-slate-100">Comments</h3>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
          {comments.length}
        </span>
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3 mb-8">
        {isAuthenticated ? (
          user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName || user.username || "User"}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-md">
              {userInitial}
            </div>
          )
        ) : (
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
            <User className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => {
              if (!isAuthenticated) {
                handleRequireAuth();
              }
            }}
            placeholder={isAuthenticated ? "Add a comment..." : "Sign in to add a comment..."}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:border-indigo-500 placeholder:text-slate-500 transition-colors"
          />
          {commentText.trim() && isAuthenticated && (
            <div className="flex items-center justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setCommentText("")}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comment List or Empty State */}
      {comments.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No comments yet"
          description="Be the first one to share what you think about this video!"
        />
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-3 group">
              {/* Avatar */}
              {comment.owner?.avatar ? (
                <img
                  src={comment.owner.avatar}
                  alt={comment.owner.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 shrink-0">
                  {comment.owner?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-200">
                    {comment.owner?.fullName || comment.owner?.username || "User"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="mt-1">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white text-xs font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-2.5 py-1 text-slate-400 text-xs hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed break-words">
                    {comment.content}
                  </p>
                )}

                {/* Comment Actions */}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{comment.likesCount || ""}</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(comment)}
                    className="hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
