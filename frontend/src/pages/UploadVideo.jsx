import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Film, Image, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "../api/api";

export default function UploadVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile || !title.trim() || !description.trim()) {
      setError("Please provide all required fields including video file and thumbnail.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();  // Video and images are binary files.
                                        // You can't send them as normal JSON. so use FormData()
      formData.append("videoFile", videoFile); 
      formData.append("thumbnail", thumbnailFile);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("isPublished", isPublished);

      const res = await fetch(ENDPOINTS.VIDEOS.PUBLISH, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        navigate("/my-uploads");
      } else {
        const errJson = await res.json().catch(() => null);
        setError(errJson?.message || "Failed to upload video. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Connection error while uploading video. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <Link
        to="/my-uploads"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Uploads</span>
      </Link>

      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Upload New Video</h1>
            <p className="text-xs text-slate-400">
              Publish a new video to your channel
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video File Dropzone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Video File *
          </label>
          <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 text-center bg-slate-900/40 transition-colors">
            <input
              type="file"
              accept="video/*"
              required
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <Film className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                {videoFile ? videoFile.name : "Select video file or drag and drop"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                MP4, WebM, or MKV (up to 4K resolution)
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Dropzone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Thumbnail Image *
          </label>
          <div className="relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center bg-slate-900/40 transition-colors">
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                <Image className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-200">
                {thumbnailFile ? thumbnailFile.name : "Select thumbnail image"}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                16:9 ratio recommended (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>

        {/* Video Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a catchy title for your video..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        {/* Video Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        {/* Publishing Status */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Publish Video Immediately
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Make this video visible publicly on your channel right after upload
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            to="/my-uploads"
            className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Uploading..." : "Upload & Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
