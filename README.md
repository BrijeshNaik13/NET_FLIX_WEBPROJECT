# Netflix-Style Movie Streaming App

A full-stack Netflix-style movie streaming application with React.js frontend and Node.js/Express backend.

## Features

- 🔐 JWT Authentication (Login/Signup)
- 🎬 Movie Search with OMDB API
- 🎨 Modern Dark Theme (Netflix-style)
- 📱 Responsive Design
- 🔒 Protected Routes
- ✨ Smooth Animations

## Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or cloud instance)

## Installation

1. **Install root dependencies**:
   ```bash
   npm install
   ```

2. **Install client dependencies**:
   ```bash
   cd client && npm install
   ```

## Running the Application

### Option 1: Run both servers (development)
```bash
npm run dev
```
This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

### Option 2: Run separately

**Start Backend:**
```bash
npm run server
```

**Start Frontend:**
```bash
npm run client
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/netflix-app
JWT_SECRET=your-secret-key
PORT=5000
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── index.js            # Server entry
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (protected)

## Default Movie API

The app uses OMDB API with key: `b44c35aa`

## License

MIT
