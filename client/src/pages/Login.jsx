import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        if (!formData.email || !emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            setLoading(false)
            return
        }

        // Validate password
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            await login(formData.email, formData.password)
            navigate('/home')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-netflix-black flex items-center justify-center p-4">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/10 via-transparent to-netflix-dark/50 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-netflix-red tracking-tight">NETFLIX</h1>
                    <p className="text-netflix-light-gray mt-2">Sign in to continue</p>
                </div>

                {/* Login Form */}
                <div className="bg-netflix-dark/80 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-gray-800/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-netflix-red text-white font-semibold py-3 px-4 rounded-md hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5 border-2 border-white/30 border-t-white" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            New to Netflix?{' '}
                            <Link
                                to="/signup"
                                className="text-white font-medium hover:underline hover:text-netflix-red transition-colors"
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-8">
                    This is a demo application for educational purposes
                </p>
            </div>
        </div>
    )
}

export default Login
