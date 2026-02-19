const OMDB_API_KEY = 'b44c35aa'
const OMDB_BASE_URL = 'https://www.omdbapi.com/'

export const searchMovies = async (query, page = 1) => {
    try {
        const response = await fetch(
            `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch movies')
        }

        const data = await response.json()

        if (data.Response === 'False') {
            throw new Error(data.Error || 'No movies found')
        }

        return {
            movies: data.Search || [],
            totalResults: parseInt(data.totalResults) || 0,
            totalPages: Math.ceil((parseInt(data.totalResults) || 0) / 10)
        }
    } catch (error) {
        console.error('OMDB API Error:', error)
        throw error
    }
}

export const getMovieDetails = async (imdbId) => {
    try {
        const response = await fetch(
            `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch movie details')
        }

        const data = await response.json()

        if (data.Response === 'False') {
            throw new Error(data.Error || 'Movie not found')
        }

        return data
    } catch (error) {
        console.error('OMDB API Error:', error)
        throw error
    }
}

// Default search for initial load
export const getPopularMovies = async () => {
    return searchMovies('popular movies', 1)
}
