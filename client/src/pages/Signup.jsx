import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { register } = useAuth()
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

        // Validate username
        if (!formData.username || formData.username.length < 3) {
            setError('Username must be at least 3 characters')
            setLoading(false)
            return
        }

        if (formData.username.length > 20) {
            setError('Username must be less than 20 characters')
            setLoading(false)
            return
        }

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

        // Check password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            await register(formData.username, formData.email, formData.password)
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
                    <p className="text-netflix-light-gray mt-2">Create your account</p>
                </div>

                {/* Signup Form */}
                <div className="bg-netflix-dark/80 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-gray-800/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
                            />
                        </div>

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
                                placeholder="Create a password"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-colors"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
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
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-white font-medium hover:underline hover:text-netflix-red transition-colors"
                            >
                                Sign in
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

export default Signup
