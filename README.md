# StreamingApp 🎬

A full-stack video streaming platform built using the **MERN Stack**. StreamingApp allows users to create accounts, explore and watch videos, upload content to their channels, interact through likes and comments, organize videos into playlists, and manage their creator activity through a dashboard.

## ✨ Features

### 👤 Authentication & User Accounts
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication using access and refresh tokens.
- HTTP-only authentication cookies.
- Protected routes for authenticated users.
- User profile, avatar, and cover image management.
- Change password and logout functionality.

### 🎥 Video Streaming & Management
- Browse publicly published videos.
- Search videos using title and description.
- Watch videos on a dedicated watch page.
- Upload videos and thumbnails.
- Store uploaded media using Cloudinary.
- Publish videos or save them as drafts.
- View, update, and delete uploaded videos.
- Track video views.

### 💬 Community & Engagement
- Add, update, and delete comments.
- Like and unlike videos.
- Like and unlike comments.
- Create and manage community posts.
- Subscribe to channels.
- View subscription information.

### 📚 Playlists & Watch History
- Create and manage playlists.
- Add and remove videos from playlists.
- View playlist details.
- Maintain watch history.
- Access liked videos and subscribed channels.

### 📊 Creator Dashboard
- View channel statistics:
  - Total videos
  - Total views
  - Subscribers
  - Total likes
- Review recent uploads.
- Check video publishing status.
- Navigate to video upload and management pages.

### 🎨 User Interface
- React-based single-page application.
- Responsive layouts using Tailwind CSS.
- Client-side navigation using React Router.
- Reusable UI components.
- Modern and user-friendly interface.

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS 4
- Lucide React
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js 5
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- Multer
- Cloudinary
- Cookie Parser
- CORS

## 📁 Project Structure

```text
StreamingApp/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── api.js
│       ├── assets/
│       ├── components/
│       │   ├── CommentSection.jsx
│       │   ├── EmptyState.jsx
│       │   ├── Loader.jsx
│       │   ├── Navbar.jsx
│       │   ├── PlaylistCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Sidebar.jsx
│       │   └── VideoCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── History.jsx
│       │   ├── Home.jsx
│       │   ├── LikedVideos.jsx
│       │   ├── Login.jsx
│       │   ├── MyUploads.jsx
│       │   ├── PlaylistDetails.jsx
│       │   ├── Playlists.jsx
│       │   ├── Profile.jsx
│       │   ├── Register.jsx
│       │   ├── Search.jsx
│       │   ├── Settings.jsx
│       │   ├── Subscriptions.jsx
│       │   ├── Tweets.jsx
│       │   ├── UploadVideo.jsx
│       │   └── Watch.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
└── streming--backend/
    ├── public/
    │   └── temp/
    ├── src/
    │   ├── controllers/
    │   ├── db/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   ├── app.js
    │   ├── constants.js
    │   └── index.js
    └── package.json
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB (Local or MongoDB Atlas)
- Cloudinary Account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Chitranshkumar18/StreamingApp.git
```

Navigate to the project directory:

```bash
cd StreamingApp
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd streming--backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory.

Add the following environment variables:

```env
PORT=8000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your actual credentials.

Start the backend development server:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:8000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173
```

The frontend uses Vite configuration to proxy API requests. For local development, make sure the proxy target in `frontend/vite.config.js` points to your local backend.

For production, configure:

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

## 🔌 API Overview

The backend exposes REST API endpoints under:

```text
/api/v1
```

| Module | Base Route | Description |
|---|---|---|
| Health Check | `/healthcheck` | Check backend health |
| Users | `/users` | Authentication and user management |
| Videos | `/videos` | Upload and manage videos |
| Comments | `/comments` | Manage video comments |
| Likes | `/likes` | Manage likes |
| Playlists | `/playlist` | Create and manage playlists |
| Subscriptions | `/subscriptions` | Manage channel subscriptions |
| Dashboard | `/dashboard` | Retrieve creator statistics |
| Tweets | `/tweets` | Community post operations |

For detailed endpoint paths, HTTP methods, and parameters, refer to the route files inside `streming--backend/src/routes/` and API configuration in `frontend/src/api/api.js`.

## ☁️ Deployment

The project includes deployment configuration for the frontend and production API integration.

### Frontend Deployment
- Vercel
- SPA routing configuration using `frontend/vercel.json`.

### Backend Deployment
- Node.js hosting platforms such as Render.

### Database
- MongoDB Atlas or a local MongoDB instance.

### Media Storage
- Cloudinary for video and image storage.

Make sure to configure all environment variables correctly before deployment.

## 🔐 Security

- Passwords are securely hashed using bcrypt.
- JWT-based authentication.
- HTTP-only cookies for authentication.
- Protected backend routes.
- Environment variables for sensitive credentials.
- CORS configuration.
- Cloudinary credentials kept on the backend.

## 👨‍💻 Author

**Chitransh Kumar**

GitHub: [@Chitranshkumar18](https://github.com/Chitranshkumar18)

## 📄 License

No explicit license has been specified for this repository. All rights are reserved by the project author unless a license is added.

---

⭐ If you find this project interesting, feel free to explore the repository and its implementation!
