import { useState, useEffect } from 'react'
import { getMovieDetails } from '../services/api'

function MovieDetails({ movie, onClose, onAddToList, onRemoveFromList, isInList }) {
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [listMessage, setListMessage] = useState('')

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true)
                const data = await getMovieDetails(movie.imdbID)
                setDetails(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [movie.imdbID])

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleAddToList = async () => {
        if (onAddToList) {
            const result = await onAddToList()
            if (result.message) {
                setListMessage(result.message)
                setTimeout(() => setListMessage(''), 3000)
            }
        }
    }

    const handleRemoveFromList = async () => {
        if (onRemoveFromList) {
            const result = await onRemoveFromList()
            if (result.message) {
                setListMessage(result.message)
                setTimeout(() => setListMessage(''), 3000)
            }
        }
    }

    // Default placeholder image
    const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect fill='%23111' width='300' height='450'/%3E%3Ccircle fill='%23333' cx='150' cy='180' r='60'/%3E%3Cpath fill='%23333' d='M120 320 L150 280 L180 320 L180 380 L120 380 Z'/%3E%3Ctext fill='%23555' font-family='Arial' font-size='14' x='150' y='400' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E`

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-netflix-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {loading && (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="spinner w-12 h-12 border-4 border-gray-800 border-t-netflix-red" />
                    </div>
                )}

                {error && (
                    <div className="p-8 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {details && !loading && !error && (
                    <div className="relative">
                        {/* Backdrop Image */}
                        {details.Poster !== 'N/A' && (
                            <div className="relative h-64 md:h-96 overflow-hidden">
                                <img
                                    src={details.Poster}
                                    alt={details.Title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/50 to-transparent" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="px-6 md:px-8 pb-8 -mt-20 relative z-10">
                            {/* Title */}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {details.Title}
                            </h2>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 text-gray-400 mb-4">
                                <span>{details.Year}</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span>{details.Runtime}</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span>{details.Genre}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400 font-bold text-xl">★ {details.imdbRating}</span>
                                    <span className="text-gray-500">/ 10</span>
                                </div>
                                <span className="text-gray-500">({details.imdbVotes} votes)</span>
                            </div>

                            {/* Plot */}
                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                {details.Plot}
                            </p>

                            {/* Additional Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <h3 className="text-gray-500 text-sm mb-1">Director</h3>
                                    <p className="text-white">{details.Director}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <h3 className="text-gray-500 text-sm mb-1">Cast</h3>
                                    <p className="text-white">{details.Actors}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <h3 className="text-gray-500 text-sm mb-1">Writer</h3>
                                    <p className="text-white">{details.Writer}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded-lg">
                                    <h3 className="text-gray-5001">Language</h3>
                                    text-sm mb- <p className="text-white">{details.Language}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="flex flex-wrap gap-2">
                                {details.Genre?.split(', ').map((genre, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            {/* Box Office & Awards */}
                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-gray-500 text-sm mb-1">Box Office</h3>
                                        <p className="text-white">{details.BoxOffice}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 text-sm mb-1">Awards</h3>
                                        <p className="text-white">{details.Awards}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Watch Button */}
                            <div className="mt-8 flex gap-4">
                                <button className="flex-1 bg-netflix-red hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Play Trailer
                                </button>
                                {isInList ? (
                                    <button
                                        onClick={handleRemoveFromList}
                                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors"
                                    >
                                        Remove from List
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddToList}
                                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-md transition-colors"
                                    >
                                        Add to List
                                    </button>
                                )}
                            </div>
                            {listMessage && (
                                <p className="mt-4 text-center text-green-400">{listMessage}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MovieDetails
