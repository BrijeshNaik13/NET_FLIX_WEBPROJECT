import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navigation menu items
export const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'tvshows', label: 'TV Shows', icon: 'tv' },
    { id: 'movies', label: 'Movies', icon: 'movie' },
    { id: 'newpopular', label: 'New & Popular', icon: 'new' },
    { id: 'mylist', label: 'My List', icon: 'list' },
    { id: 'categories', label: 'Categories', icon: 'category' },
    { id: 'comingsoon', label: 'Coming Soon', icon: 'soon' }
]

function Navbar({ onSearch, onShowMyList, onShowHome, activeNav, onNavChange }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const { user, logout, myList } = useAuth()
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

    const handleNavClick = (item) => {
        if (item.id === 'mylist') {
            onShowMyList()
        } else if (item.id === 'home') {
            onShowHome()
        } else {
            onNavChange(item.id)
        }
    }

    const getIcon = (icon) => {
        switch (icon) {
            case 'home':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                )
            case 'tv':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
                    </svg>
                )
            case 'movie':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                )
            case 'new':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                )
            case 'list':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )
            case 'category':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                )
            case 'soon':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 to-black/80">
            <div className="px-4 md:px-8 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <h1
                            className="text-2xl md:text-3xl font-bold text-netflix-red cursor-pointer"
                            onClick={onShowHome}
                        >
                            NETFLIX
                        </h1>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item)}
                                    className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1.5 ${activeNav === item.id
                                            ? 'text-white font-medium'
                                            : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {getIcon(item.icon)}
                                    {item.label}
                                    {item.id === 'mylist' && myList.length > 0 && (
                                        <span className="bg-netflix-red text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                                            {myList.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-white p-2"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:block">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Titles, people, genres"
                                    className="w-40 md:w-64 px-4 py-1.5 bg-gray-900/80 border border-gray-700 rounded-full text-white text-sm placeholder-gray-400 focus:border-white focus:outline-none focus:w-72 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Notifications */}
                        <button className="text-gray-300 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                        </button>

                        {/* User Section */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="w-7 h-7 bg-netflix-red rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="text-gray-300 hover:text-white text-sm transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {showMobileMenu && (
                    <div className="lg:hidden mt-4 pb-2 border-t border-gray-800 pt-2">
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        handleNavClick(item)
                                        setShowMobileMenu(false)
                                    }}
                                    className={`px-3 py-2 text-left rounded transition-colors flex items-center gap-3 ${activeNav === item.id
                                            ? 'text-white font-medium bg-gray-800'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {getIcon(item.icon)}
                                    {item.label}
                                    {item.id === 'mylist' && myList.length > 0 && (
                                        <span className="bg-netflix-red text-white text-xs px-2 py-0.5 rounded-full">
                                            {myList.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mt-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search movies..."
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-white focus:outline-none"
                                />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
