import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('')
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim())
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
            <div className="px-4 md:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <h1
                            className="text-3xl font-bold text-netflix-red cursor-pointer"
                            onClick={() => onSearch('')}
                        >
                            NETFLIX
                        </h1>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => onSearch('')}
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                Home
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies..."
                                className="w-full px-4 py-2 bg-gray-900/80 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:border-netflix-red focus:outline-none focus:ring-1 focus:ring-netflix-red transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* User Section */}
                    <div className="flex items-center gap-4">
                        {/* Username */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 bg-netflix-red rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-white text-sm font-medium">
                                {user?.username}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
