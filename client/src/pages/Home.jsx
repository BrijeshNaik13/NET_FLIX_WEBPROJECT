import { useState, useEffect } from 'react'
import Navbar, { navItems } from '../components/Navbar'
import MovieRow from '../components/MovieRow'
import MovieDetails from '../components/MovieDetails'
import LoadingSpinner from '../components/LoadingSpinner'
import { getTMDBData, searchMovies } from '../services/api'
import { useAuth } from '../context/AuthContext'

// SVG placeholder for missing images
const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect fill='%23111' width='300' height='450'/%3E%3Ccircle fill='%23333' cx='150' cy='180' r='60'/%3E%3Cpath fill='%23333' d='M120 320 L150 280 L180 320 L180 380 L120 380 Z'/%3E%3Ctext fill='%23555' font-family='Arial' font-size='14' x='150' y='400' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E`

const getPosterUrl = (movie) => {
    if (movie.tmdbPoster) {
        return movie.tmdbPoster
    }
    if (movie.Poster && movie.Poster !== 'N/A' && movie.Poster.startsWith('http')) {
        return movie.Poster
    }
    return placeholderImage
}

// Category configurations for different nav items
const categoryConfigs = {
    home: {
        title: 'Popular Movies',
        subtitle: 'Discover the best movies to watch',
        categories: [
            { id: 'popular', title: 'Popular on Netflix', endpoint: '/movie/popular' },
            { id: 'trending', title: 'Trending Now', endpoint: '/trending/movie/week' },
            { id: 'now_playing', title: 'Now Playing', endpoint: '/movie/now_playing' },
            { id: 'top_rated', title: 'Top Rated', endpoint: '/movie/top_rated' },
            { id: 'upcoming', title: 'Upcoming', endpoint: '/movie/upcoming' }
        ]
    },
    tvshows: {
        title: 'TV Shows',
        subtitle: 'Popular TV shows streaming now',
        categories: [
            { id: 'tv_popular', title: 'Popular TV Shows', endpoint: '/tv/popular' },
            { id: 'tv_toprated', title: 'Top Rated TV Shows', endpoint: '/tv/top_rated' },
            { id: 'tv_ontheair', title: 'On The Air', endpoint: '/tv/on_the_air' },
            { id: 'tv_airing', title: 'Airing Today', endpoint: '/tv/airing_today' }
        ]
    },
    movies: {
        title: 'Movies',
        subtitle: 'Stream movies online',
        categories: [
            { id: 'movie_popular', title: 'Popular Movies', endpoint: '/movie/popular' },
            { id: 'movie_action', title: 'Action', endpoint: '/discover/movie?with_genres=28' },
            { id: 'movie_comedy', title: 'Comedy', endpoint: '/discover/movie?with_genres=35' },
            { id: 'movie_horror', title: 'Horror', endpoint: '/discover/movie?with_genres=27' },
            { id: 'movie_romance', title: 'Romance', endpoint: '/discover/movie?with_genres=10749' }
        ]
    },
    newpopular: {
        title: 'New & Popular',
        subtitle: 'New releases and trending content',
        categories: [
            { id: 'new_trending', title: 'Trending This Week', endpoint: '/trending/movie/week' },
            { id: 'new_movie', title: 'New Movies', endpoint: '/movie/now_playing' },
            { id: 'new_tv', title: 'New TV Shows', endpoint: '/tv/on_the_air' },
            { id: 'new_popular', title: 'Popular Now', endpoint: '/trending/movie/day' }
        ]
    },
    categories: {
        title: 'Browse by Category',
        subtitle: 'Explore movies by genre',
        categories: [
            { id: 'cat_action', title: 'Action', endpoint: '/discover/movie?with_genres=28' },
            { id: 'cat_comedy', title: 'Comedy', endpoint: '/discover/movie?with_genres=35' },
            { id: 'cat_horror', title: 'Horror', endpoint: '/discover/movie?with_genres=27' },
            { id: 'cat_romance', title: 'Romance', endpoint: '/discover/movie?with_genres=10749' },
            { id: 'cat_scifi', title: 'Sci-Fi', endpoint: '/discover/movie?with_genres=878' },
            { id: 'cat_thriller', title: 'Thriller', endpoint: '/discover/movie?with_genres=53' },
            { id: 'cat_animation', title: 'Animation', endpoint: '/discover/movie?with_genres=16' },
            { id: 'cat_documentary', title: 'Documentary', endpoint: '/discover/movie?with_genres=99' }
        ]
    },
    comingsoon: {
        title: 'Coming Soon',
        subtitle: 'Upcoming movies and shows',
        categories: [
            { id: 'soon_movies', title: 'Upcoming Movies', endpoint: '/movie/upcoming' },
            { id: 'soon_tv', title: 'Upcoming TV', endpoint: '/tv/on_the_air' },
            { id: 'soon_theaters', title: 'In Theaters', endpoint: '/movie/now_playing' }
        ]
    }
}

function Home() {
    const [activeNav, setActiveNav] = useState('home')
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searched, setSearched] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [showMyList, setShowMyList] = useState(false)

    const { myList, addToMyList, removeFromMyList } = useAuth()

    // Fetch categories based on active navigation
    useEffect(() => {
        const fetchCategories = async () => {
            if (showMyList || searched) return

            setLoading(true)
            setError(null)

            try {
                const config = categoryConfigs[activeNav] || categoryConfigs.home

                // Fetch categories for current nav
                const categoriesData = await Promise.all(
                    config.categories.map(async (category) => {
                        try {
                            const data = await getTMDBData(category.endpoint)
                            const movies = (data.results || []).slice(0, 10).map(movie => ({
                                imdbID: movie.id.toString(),
                                Title: movie.title || movie.name,
                                Year: (movie.release_date || movie.first_air_date || '').split('-')[0] || 'N/A',
                                Type: movie.media_type === 'tv' ? 'tv' : 'movie',
                                Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                                tmdbPoster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                                overview: movie.overview,
                                vote_average: movie.vote_average
                            }))
                            return { ...category, movies }
                        } catch (error) {
                            console.error(`Error fetching ${category.title}:`, error)
                            return { ...category, movies: [] }
                        }
                    })
                )
                setCategories(categoriesData)
            } catch (err) {
                setError(err.message || 'Failed to fetch content. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [activeNav, showMyList, searched])

    // Handle search from navbar
    const handleSearch = async (query) => {
        setSearchQuery(query)

        if (!query.trim()) {
            setSearched(false)
            setSearchResults([])
            return
        }

        setSearched(true)
        setShowMyList(false)
        setLoading(true)

        try {
            const result = await searchMovies(query)
            setSearchResults(result.movies)
        } catch (err) {
            setError(err.message || 'Failed to search movies.')
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }

    // Handle navigation change
    const handleNavChange = (navId) => {
        setActiveNav(navId)
        setShowMyList(false)
        setSearched(false)
        setSearchQuery('')
    }

    // Handle movie card click
    const handleMovieClick = (movie) => {
        setSelectedMovie(movie)
    }

    // Handle closing movie details
    const handleCloseDetails = () => {
        setSelectedMovie(null)
    }

    // Handle show my list
    const handleShowMyList = () => {
        setShowMyList(true)
        setSearched(false)
    }

    // Handle show home
    const handleShowHome = () => {
        setShowMyList(false)
        setSearched(false)
        setSearchQuery('')
        setActiveNav('home')
    }

    const config = categoryConfigs[activeNav] || categoryConfigs.home

    return (
        <div className="min-h-screen bg-netflix-black">
            {/* Navbar */}
            <Navbar
                onSearch={handleSearch}
                onShowMyList={handleShowMyList}
                onShowHome={handleShowHome}
                activeNav={activeNav}
                onNavChange={handleNavChange}
            />

            {/* Main Content */}
            <div className="pt-20 pb-8">
                {/* Loading State */}
                {loading && <LoadingSpinner />}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
                            <p className="text-red-400 text-lg mb-4">{error}</p>
                            <button
                                onClick={() => handleNavChange(activeNav)}
                                className="px-6 py-2 bg-netflix-red text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {!loading && !error && searched && (
                    <div className="px-4 md:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Search Results
                        </h2>
                        <p className="text-gray-400 mb-6">
                            {searchResults.length} results for "{searchQuery}"
                        </p>

                        {searchResults.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                                <h3 className="text-xl text-gray-300 mb-2">No movies found</h3>
                                <p className="text-gray-500">Try searching for something else</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {searchResults.map((movie, index) => (
                                    <div
                                        key={`${movie.imdbID}-${index}`}
                                        className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                        onClick={() => handleMovieClick(movie)}
                                    >
                                        <img
                                            src={getPosterUrl(movie)}
                                            alt={movie.Title}
                                            className="w-full rounded-md shadow-lg"
                                            onError={(e) => { e.target.src = placeholderImage }}
                                        />
                                        <h3 className="text-white text-sm mt-2 truncate">{movie.Title}</h3>
                                        <p className="text-gray-400 text-xs">{movie.Year}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* My List */}
                {!loading && !error && showMyList && (
                    <div className="px-4 md:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            My List
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Your saved movies and shows
                        </p>

                        {myList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                                <h3 className="text-xl text-gray-300 mb-2">Your list is empty</h3>
                                <p className="text-gray-500">Add movies to your list by clicking "Add to List"</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {myList.map((movie, index) => (
                                    <div
                                        key={`${movie.imdbID}-${index}`}
                                        className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                        onClick={() => handleMovieClick(movie)}
                                    >
                                        <img
                                            src={getPosterUrl(movie)}
                                            alt={movie.Title}
                                            className="w-full rounded-md shadow-lg"
                                            onError={(e) => { e.target.src = placeholderImage }}
                                        />
                                        <h3 className="text-white text-sm mt-2 truncate">{movie.Title}</h3>
                                        <p className="text-gray-400 text-xs">{movie.Year}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Category Content */}
                {!loading && !error && !searched && !showMyList && (
                    <div>
                        {/* Hero Banner */}
                        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/50 to-netflix-black z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&q=80"
                                alt={config.title}
                                className="w-full h-full object-cover opacity-40"
                            />
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 text-center">
                                    {config.title}
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl text-center max-w-2xl">
                                    {config.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Movie Categories */}
                        <div className="-mt-20 relative z-20 pb-16">
                            {categories.map((category) => (
                                category.movies && category.movies.length > 0 && (
                                    <MovieRow
                                        key={category.id}
                                        title={category.title}
                                        movies={category.movies}
                                        onMovieClick={handleMovieClick}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Movie Details Modal */}
            {selectedMovie && (
                <MovieDetails
                    movie={selectedMovie}
                    onClose={handleCloseDetails}
                    onAddToList={() => addToMyList(selectedMovie)}
                    onRemoveFromList={() => removeFromMyList(selectedMovie.imdbID)}
                    isInList={myList.some(m => m.imdbID === selectedMovie.imdbID)}
                />
            )}

            {/* Footer */}
            <footer className="bg-netflix-dark border-t border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Netflix Movie App © 2024. Powered by TMDB API
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Home
