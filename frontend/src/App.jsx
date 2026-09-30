import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Watch from "./pages/Watch";
import History from "./pages/History";
import LikedVideos from "./pages/LikedVideos";
import Subscriptions from "./pages/Subscriptions";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";
import MyUploads from "./pages/MyUploads";
import UploadVideo from "./pages/UploadVideo";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Tweets from "./pages/Tweets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
          {/* Left Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {/* Main Content Area */}
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all duration-300">
            {/* Top Navigation Bar */}
            <Navbar
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />

            {/* Page Viewport */}
            <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/search" element={<Search />} />
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/liked-videos"
                  element={
                    <ProtectedRoute>
                      <LikedVideos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscriptions"
                  element={
                    <ProtectedRoute>
                      <Subscriptions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playlists"
                  element={
                    <ProtectedRoute>
                      <Playlists />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/playlist/:playlistId"
                  element={
                    <ProtectedRoute>
                      <PlaylistDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-uploads"
                  element={
                    <ProtectedRoute>
                      <MyUploads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <UploadVideo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tweets"
                  element={
                    <ProtectedRoute>
                      <Tweets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
