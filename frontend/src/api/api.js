/**
 * API Configuration & Endpoints Reference
 * 
 * This file contains base endpoints and configuration ready for manual backend integration.
 * Currently, no real network requests are executed.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL && !import.meta.env.DEV
    ? import.meta.env.VITE_API_URL
    : import.meta.env.DEV
    ? "/api/v1"
    : "https://streamingapp-6adv.onrender.com/api/v1";

export const ENDPOINTS = {
  // Auth & User routes
  AUTH: {
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
    LOGOUT: `${API_BASE_URL}/users/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/users/refresh-token`,
    CURRENT_USER: `${API_BASE_URL}/users/current-user`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
    UPDATE_ACCOUNT: `${API_BASE_URL}/users/update-account`,
    UPDATE_AVATAR: `${API_BASE_URL}/users/avatar`,
    UPDATE_COVER_IMAGE: `${API_BASE_URL}/users/cover-image`,
    USER_CHANNEL_PROFILE: (username) => `${API_BASE_URL}/users/c/${username}`,
    WATCH_HISTORY: `${API_BASE_URL}/users/history`,
  },

  // Video routes
  VIDEOS: {
    BASE: `${API_BASE_URL}/videos`,
    GET_ALL: `${API_BASE_URL}/videos`,
    PUBLISH: `${API_BASE_URL}/videos`,
    GET_BY_ID: (videoId) => `${API_BASE_URL}/videos/${videoId}`,
    UPDATE: (videoId) => `${API_BASE_URL}/videos/${videoId}`,
    DELETE: (videoId) => `${API_BASE_URL}/videos/${videoId}`,
    TOGGLE_PUBLISH: (videoId) => `${API_BASE_URL}/videos/toggle/publish/${videoId}`,
  },

  // Comments
  COMMENTS: {
    GET_VIDEO_COMMENTS: (videoId) => `${API_BASE_URL}/comments/${videoId}`,
    ADD_COMMENT: (videoId) => `${API_BASE_URL}/comments/${videoId}`,
    UPDATE_COMMENT: (commentId) => `${API_BASE_URL}/comments/c/${commentId}`,
    DELETE_COMMENT: (commentId) => `${API_BASE_URL}/comments/c/${commentId}`,
  },

  // Likes
  LIKES: {
    TOGGLE_VIDEO_LIKE: (videoId) => `${API_BASE_URL}/likes/toggle/v/${videoId}`,
    TOGGLE_COMMENT_LIKE: (commentId) => `${API_BASE_URL}/likes/toggle/c/${commentId}`,
    TOGGLE_TWEET_LIKE: (tweetId) => `${API_BASE_URL}/likes/toggle/t/${tweetId}`,
    GET_LIKED_VIDEOS: `${API_BASE_URL}/likes/videos`,
  },

  // Playlists
  PLAYLISTS: {
    CREATE: `${API_BASE_URL}/playlist`,
    GET_BY_ID: (playlistId) => `${API_BASE_URL}/playlist/${playlistId}`,
    UPDATE: (playlistId) => `${API_BASE_URL}/playlist/${playlistId}`,
    DELETE: (playlistId) => `${API_BASE_URL}/playlist/${playlistId}`,
    ADD_VIDEO: (videoId, playlistId) => `${API_BASE_URL}/playlist/add/${videoId}/${playlistId}`,
    REMOVE_VIDEO: (videoId, playlistId) => `${API_BASE_URL}/playlist/remove/${videoId}/${playlistId}`,
    GET_USER_PLAYLISTS: (userId) => `${API_BASE_URL}/playlist/user/${userId}`,
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    TOGGLE: (channelId) => `${API_BASE_URL}/subscriptions/c/${channelId}`,
    GET_SUBSCRIBED_CHANNELS: (channelId) => `${API_BASE_URL}/subscriptions/c/${channelId}`,
    GET_CHANNEL_SUBSCRIBERS: (subscriberId) => `${API_BASE_URL}/subscriptions/u/${subscriberId}`,
  },

  // Dashboard
  DASHBOARD: {
    GET_STATS: `${API_BASE_URL}/dashboard/stats`,
    GET_VIDEOS: `${API_BASE_URL}/dashboard/videos`,
  },

  // Tweets / Community
  TWEETS: {
    CREATE: `${API_BASE_URL}/tweets`,
    GET_USER_TWEETS: (userId) => `${API_BASE_URL}/tweets/user/${userId}`,
    UPDATE: (tweetId) => `${API_BASE_URL}/tweets/${tweetId}`,
    DELETE: (tweetId) => `${API_BASE_URL}/tweets/${tweetId}`,
  },

  // Healthcheck
  HEALTHCHECK: `${API_BASE_URL}/healthcheck`,
};
