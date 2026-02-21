function MovieCard({ movie, onClick }) {
    const { Title, Year, Type, Poster, tmdbPoster } = movie

    // SVG placeholder
    const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect fill='%23111' width='300' height='450'/%3E%3Ccircle fill='%23333' cx='150' cy='180' r='60'/%3E%3Cpath fill='%23333' d='M120 320 L150 280 L180 320 L180 380 L120 380 Z'/%3E%3Ctext fill='%23555' font-family='Arial' font-size='14' x='150' y='400' text-anchor='middle'%3ENo Poster%3C/text%3E%3C/svg%3E`

    // Get poster - prefer TMDB poster
    const posterUrl = tmdbPoster || (Poster && Poster !== 'N/A' ? Poster : null)

    const handleImageError = (e) => {
        e.target.src = placeholderImage
    }

    return (
        <div
            className="movie-card group relative bg-netflix-dark rounded-lg overflow-hidden cursor-pointer animate-fadeIn"
            onClick={onClick}
        >
            {/* Poster Image */}
            <div className="aspect-[2/3] relative overflow-hidden bg-gray-900">
                <img
                    src={posterUrl || placeholderImage}
                    alt={Title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={handleImageError}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-netflix-red/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Movie Info */}
            <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate group-hover:text-netflix-red transition-colors">
                    {Title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400 text-xs">
                        {Year || 'N/A'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded capitalize">
                        {Type || 'movie'}
                    </span>
                </div>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-netflix-red rounded-lg transition-colors duration-300 pointer-events-none" />
        </div>
    )
}

export default MovieCard
