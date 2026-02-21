import { useRef } from 'react'
import MovieCard from './MovieCard'

function MovieRow({ title, movies, onMovieClick }) {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300
            if (direction === 'left') {
                scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    if (!movies || movies.length === 0) return null

    return (
        <div className="mb-8">
            {/* Section Title */}
            <div className="flex items-center justify-between px-4 md:px-8 mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-white hover:text-netflix-red cursor-pointer transition-colors">
                    {title}
                </h3>
            </div>

            {/* Movie Row with Navigation */}
            <div className="relative group">
                {/* Left Scroll Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    style={{ width: '40px' }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Movies Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 py-2"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {movies.map((movie, index) => (
                        <div
                            key={`${movie.imdbID}-${index}`}
                            className="flex-shrink-0 w-[140px] md:w-[180px] lg:w-[200px]"
                        >
                            <MovieCard
                                movie={movie}
                                onClick={() => onMovieClick(movie)}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-10 bg-black/50 hover:bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    style={{ width: '40px' }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default MovieRow
