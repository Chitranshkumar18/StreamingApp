import React, { useState, useEffect } from "react";
import { User, Mail, Camera, Shield, Check, Save, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ENDPOINTS } from "../api/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("account"); // account | password

  // Form states initialized with real user data
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user]);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savedSuccess, setSavedSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSavedSuccess("");

    try {
      const res = await fetch(ENDPOINTS.AUTH.UPDATE_ACCOUNT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ fullName, email }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          updateUser(data.data);
        }
        setSavedSuccess("Profile changes saved successfully.");
        setTimeout(() => setSavedSuccess(""), 3000);
      } else {
        const errJson = await res.json().catch(() => null);
        setErrorMsg(errJson?.message || "Failed to update account details.");
      }
    } catch (err) {
      console.error("Failed to update account:", err);
      setErrorMsg("Connection error while updating profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSavedSuccess("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSavedSuccess("Password changed successfully.");
        setTimeout(() => setSavedSuccess(""), 3000);
      } else {
        const errJson = await res.json().catch(() => null);
        setErrorMsg(errJson?.message || "Failed to change password. Please check your current password.");
      }
    } catch (err) {
      console.error("Failed to change password:", err);
      setErrorMsg("Connection error while changing password.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(ENDPOINTS.AUTH.UPDATE_AVATAR, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          updateUser(data.data);
        }
        setSavedSuccess("Avatar updated successfully.");
        setTimeout(() => setSavedSuccess(""), 3000);
      } else {
        const errJson = await res.json().catch(() => null);
        setErrorMsg(errJson?.message || "Failed to update avatar.");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setErrorMsg("Error uploading avatar image.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const res = await fetch(ENDPOINTS.AUTH.UPDATE_COVER_IMAGE, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          updateUser(data.data);
        }
        setSavedSuccess("Cover banner updated successfully.");
        setTimeout(() => setSavedSuccess(""), 3000);
      } else {
        const errJson = await res.json().catch(() => null);
        setErrorMsg(errJson?.message || "Failed to update cover image.");
      }
    } catch (err) {
      console.error("Cover upload failed:", err);
      setErrorMsg("Error uploading cover image.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const userInitials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : username
    ? username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Cover Banner & Avatar Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        {/* Cover Image Area */}
        <div className="h-44 md:h-56 w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 relative flex items-center justify-center">
          {user?.coverImage && (
            <img
              src={user.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 right-4">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-xs font-medium text-slate-200 border border-white/10 hover:bg-black/80 transition-colors cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
              <span>{isUploadingCover ? "Uploading..." : "Change Banner"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 md:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-3xl flex items-center justify-center border-4 border-[#080c16] shadow-2xl overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                <Camera className="w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Title & Handle */}
            <div className="mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                {fullName || "Your Channel"}
              </h1>
              <p className="text-xs text-slate-400">@{username || "username"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 md:px-8 border-t border-slate-800 flex items-center gap-6">
          <button
            onClick={() => setActiveTab("account")}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "account"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Account Details
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "password"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Security & Password
          </button>
        </div>
      </div>

      {/* Success / Error Banners */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Account Details Tab */}
      {activeTab === "account" && (
        <form
          onSubmit={handleUpdateAccount}
          className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6"
        >
          <h2 className="text-base font-bold text-white">Channel Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="text-xs text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Security & Password Tab */}
      {activeTab === "password" && (
        <form
          onSubmit={handleChangePassword}
          className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6"
        >
          <h2 className="text-base font-bold text-white">Change Password</h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
