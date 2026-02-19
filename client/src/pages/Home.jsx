import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import MovieDetails from '../components/MovieDetails'
import LoadingSpinner from '../components/LoadingSpinner'
import { searchMovies } from '../services/api'

function Home() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searched, setSearched] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null)

    // Debounce search
    const debounce = (func, wait) => {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    const fetchMovies = useCallback(async (query) => {
        setLoading(true)
        setError(null)

        try {
            // Use a default search if no query provided
            const searchTerm = query || 'action'
            const result = await searchMovies(searchTerm)
            setMovies(result.movies)
            setSearched(!!query)
        } catch (err) {
            setError(err.message || 'Failed to fetch movies. Please try again.')
            setMovies([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial load - fetch default movies
    useEffect(() => {
        fetchMovies('')
    }, [fetchMovies])

    // Handle search from navbar
    const handleSearch = (query) => {
        setSearchQuery(query)
        debounce(() => fetchMovies(query), 500)()
    }

    // Immediate search on form submit
    const handleSearchSubmit = (query) => {
        setSearchQuery(query)
        fetchMovies(query)
    }

    // Handle movie card click
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie)
    }

    // Handle closing movie details
    const handleCloseDetails = () => {
        setSelectedMovie(null)
    }

    return (
        <div className="min-h-screen bg-netflix-black">
            {/* Navbar */}
            <Navbar onSearch={handleSearchSubmit} />

            {/* Hero Section */}
            <div className="relative pt-20 pb-8">
                {/* Hero Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-netflix-black/50 to-netflix-black z-0" />

                {/* Hero Content */}
                <div className="relative z-10 px-4 md:px-8 pt-16 pb-8">
                    <div className="max-w-7xl mx-auto">
                        {searched ? (
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Search Results
                            </h2>
                        ) : (
                            <>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Popular Movies
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    Discover the best movies to watch
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Movies Grid */}
            <div className="relative z-10 px-4 md:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    {/* Loading State */}
                    {loading && <LoadingSpinner />}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
                                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-400 text-lg mb-4">{error}</p>
                                <button
                                    onClick={() => fetchMovies(searchQuery || '')}
                                    className="px-6 py-2 bg-netflix-red text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Movies Found */}
                    {!loading && !error && movies.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                            <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <h3 className="text-xl text-gray-300 mb-2">No movies found</h3>
                            <p className="text-gray-500">Try searching for something else</p>
                        </div>
                    )}

                    {/* Movies Grid */}
                    {!loading && !error && movies.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                            {movies.map((movie, index) => (
                                <div
                                    key={`${movie.imdbID}-${index}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Movie Details Modal */}
            {selectedMovie && (
                <MovieDetails movie={selectedMovie} onClose={handleCloseDetails} />
            )}

            {/* Footer */}
            <footer className="bg-netflix-dark border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Netflix Movie App © 2024. Powered by OMDB API
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
