function MovieCard({ movie, onClick }) {
    const { Title, Year, Type, Poster } = movie

    // Default placeholder image
    const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"%3E%3Crect fill="%23222" width="300" height="450"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'

    return (
        <div
            className="movie-card group relative bg-netflix-dark rounded-lg overflow-hidden cursor-pointer animate-fadeIn"
            onClick={onClick}
        >
            {/* Poster Image */}
            <div className="aspect-[2/3] relative overflow-hidden">
                <img
                    src={Poster !== 'N/A' ? Poster : placeholderImage}
                    alt={Title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
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
            <div className="p-4">
                <h3 className="text-white font-semibold text-sm md:text-base truncate group-hover:text-netflix-red transition-colors">
                    {Title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400 text-xs md:text-sm">
                        {Year}
                    </span>
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded capitalize">
                        {Type}
                    </span>
                </div>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-netflix-red rounded-lg transition-colors duration-300 pointer-events-none" />
        </div>
    )
}

export default MovieCard
