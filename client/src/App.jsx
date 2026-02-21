import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
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

    return isAuthenticated ? children : <Navigate to="/" />
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
                    {/* Landing Page - First page users see */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Landing />
                            </PublicRoute>
                        }
                    />

                    {/* Auth Page - Login/Signup toggle */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Auth />
                            </PublicRoute>
                        }
                    />

                    {/* Home Page - Protected */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
