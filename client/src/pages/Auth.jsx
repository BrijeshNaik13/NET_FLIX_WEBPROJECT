import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, Play, ArrowRight, Loader2 } from 'lucide-react'

export default function Auth() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, register, isAuthenticated, loading: authLoading } = useAuth()

    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [animated, setAnimated] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        setAnimated(true)
        // Check if coming from signup
        if (location.state?.from === 'signup') {
            setIsLogin(false)
        }
    }, [location])

    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            navigate('/home')
        }
    }, [isAuthenticated, authLoading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await login(formData.email, formData.password)
                navigate('/home')
            } else {
                await register(formData.name, formData.email, formData.password)
                setIsLogin(true)
                setError('')
                setFormData({ name: '', email: '', password: '' })
            }
        } catch (err) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setAnimated(false)
        setError('')
        setTimeout(() => {
            setIsLogin(!isLogin)
            setAnimated(true)
        }, 150)
    }

    return (
        <div className="min-h-screen bg-netflix-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/30 via-netflix-black to-purple-900/30" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80')] bg-cover bg-center opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-netflix-black" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-netflix-red/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-700" />
            </div>

            {/* Glass Card */}
            <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${animated ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-netflix-red rounded-2xl transform -rotate-12 mb-4 shadow-[0_0_30px_rgba(229,9,20,0.4)]">
                        <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-400 mt-2">
                        {isLogin ? 'Sign in to continue watching' : 'Start your streaming journey'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field (Signup only) */}
                        {!isLogin && (
                            <div className="group relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-netflix-red transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition-all duration-300"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="group relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-netflix-red transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="group relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-netflix-red transition-colors" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/20 transition-all duration-300"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || authLoading}
                            className="w-full bg-gradient-to-r from-netflix-red via-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Toggle Mode */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={toggleMode}
                                className="ml-2 text-netflix-red hover:text-white font-semibold transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}
