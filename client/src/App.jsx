import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'

// Protected Route Component
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-netflix-black flex items-center justify-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        )
    }

    return isAuthenticated ? children : <Navigate to="/login" />
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-netflix-black flex items-center justify-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        )
    }

    return isAuthenticated ? <Navigate to="/home" /> : children
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
