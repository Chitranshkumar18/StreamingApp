import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Moon, Shield, Volume2, Globe } from "lucide-react";

export default function Settings() {
  const [autoplay, setAutoplay] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [streamQuality, setStreamQuality] = useState("1080p");

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
            <p className="text-xs text-slate-400">
              Customize your viewing experience and app preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Playback Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Playback & Video Quality</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <div>
              <p className="text-xs font-medium text-slate-200">Autoplay Next Video</p>
              <p className="text-[11px] text-slate-400">
                Automatically play the next related video when the current one finishes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-slate-200">Default Video Quality</p>
              <p className="text-[11px] text-slate-400">
                Preferred streaming resolution
              </p>
            </div>
            <select
              value={streamQuality}
              onChange={(e) => setStreamQuality(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="Auto">Auto (Recommended)</option>
              <option value="1080p">1080p Full HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
            </select>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Bell className="w-4 h-4 text-purple-400" />
            <span>Notification Preferences</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-slate-200">Subscription Alerts</p>
              <p className="text-[11px] text-slate-400">
                Notify when channels you follow upload new videos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Theme & Display</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-slate-200">Dark Platform Mode</p>
              <p className="text-[11px] text-slate-400">
                Streaming dark theme enabled by default
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Enabled (Dark Theme)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
