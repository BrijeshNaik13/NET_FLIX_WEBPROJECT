const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

// OMDB API for search
const OMDB_API_KEY = 'b44c35aa'
const OMDB_BASE_URL = 'https://www.omdbapi.com/'

// Get TMDB image URL with proper sizing
export const getTMDBImageUrl = (path, size = 'w500') => {
    if (!path) return null
    return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// Generic TMDB data fetch
export const getTMDBData = async (endpoint) => {
    try {
        // Handle endpoints that already have query params
        const separator = endpoint.includes('?') ? '&' : '?'
        const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}&language=en-US`
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('TMDB Error:', error)
        throw error
    }
}

// Search movies using OMDB (for search functionality)
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

        // Transform OMDB results to include TMDB poster paths
        const movies = await Promise.all(
            (data.Search || []).map(async (movie) => {
                // Try to get TMDB poster
                const tmdbPoster = await getTMDBPoster(movie.Title, movie.Year)
                return {
                    ...movie,
                    tmdbPoster: tmdbPoster
                }
            })
        )

        return {
            movies: movies,
            totalResults: parseInt(data.totalResults) || 0,
            totalPages: Math.ceil((parseInt(data.totalResults) || 0) / 10)
        }
    } catch (error) {
        console.error('OMDB API Error:', error)
        throw error
    }
}

// Get TMDB poster for a movie
const getTMDBPoster = async (title, year) => {
    try {
        // Search for movie on TMDB
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year.split('-')[0] || year}` : ''}`

        const response = await fetch(searchUrl)
        const data = await response.json()

        if (data.results && data.results.length > 0) {
            const movie = data.results[0]
            if (movie.poster_path) {
                return getTMDBImageUrl(movie.poster_path, 'w500')
            }
        }
        return null
    } catch (error) {
        console.error('TMDB Error:', error)
        return null
    }
}

// Get popular movies from TMDB directly
export const getPopularMoviesTMDB = async () => {
    try {
        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        const response = await fetch(url)
        const data = await response.json()

        if (!data.results) {
            throw new Error('Failed to fetch popular movies')
        }

        const movies = data.results.map(movie => ({
            imdbID: movie.id.toString(),
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            Type: 'movie',
            Poster: movie.poster_path ? getTMDBImageUrl(movie.poster_path, 'w500') : null,
            tmdbPoster: movie.poster_path ? getTMDBImageUrl(movie.poster_path, 'w500') : null,
            overview: movie.overview,
            vote_average: movie.vote_average
        }))

        return { movies, totalResults: data.total_results }
    } catch (error) {
        console.error('TMDB Popular Error:', error)
        throw error
    }
}

// Get movie details from TMDB
export const getMovieDetails = async (imdbId) => {
    // Try TMDB first
    try {
        const url = `${TMDB_BASE_URL}/movie/${imdbId}?api_key=${TMDB_API_KEY}&language=en-US`
        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json()

            return {
                Title: data.title,
                Year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
                Rated: 'N/A',
                Runtime: data.runtime ? `${data.runtime} min` : 'N/A',
                Genre: data.genres ? data.genres.map(g => g.name).join(', ') : 'N/A',
                Director: 'N/A',
                Actors: 'N/A',
                Plot: data.overview || 'No plot available.',
                Poster: data.poster_path ? getTMDBImageUrl(data.poster_path, 'w500') : null,
                tmdbPoster: data.poster_path ? getTMDBImageUrl(data.poster_path, 'w500') : null,
                imdbRating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
                imdbID: imdbId,
                Type: 'movie'
            }
        }
    } catch (error) {
        console.error('TMDB Details Error:', error)
    }

    // Fallback to OMDB
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
        console.error('OMDB Details Error:', error)
        throw error
    }
}

// Get all categories from TMDB
export const getAllCategories = async () => {
    const categories = [
        { id: 'popular', title: 'Popular Movies', endpoint: '/movie/popular' },
        { id: 'now_playing', title: 'Now Playing', endpoint: '/movie/now_playing' },
        { id: 'top_rated', title: 'Top Rated', endpoint: '/movie/top_rated' },
        { id: 'upcoming', title: 'Upcoming', endpoint: '/movie/upcoming' },
        { id: 'action', title: 'Action Movies', endpoint: '/movie/popular', genre: 28 },
        { id: 'comedy', title: 'Comedy Movies', endpoint: '/movie/popular', genre: 35 },
        { id: 'horror', title: 'Horror Movies', endpoint: '/movie/popular', genre: 27 },
        { id: 'romance', title: 'Romance Movies', endpoint: '/movie/popular', genre: 10749 }
    ]

    const results = await Promise.all(
        categories.map(async (category) => {
            try {
                let url = `${TMDB_BASE_URL}${category.endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
                if (category.genre) {
                    url += `&with_genres=${category.genre}`
                }

                const response = await fetch(url)
                const data = await response.json()

                const movies = (data.results || []).slice(0, 10).map(movie => ({
                    imdbID: movie.id.toString(),
                    Title: movie.title,
                    Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                    Type: 'movie',
                    Poster: movie.poster_path ? getTMDBImageUrl(movie.poster_path, 'w500') : null,
                    tmdbPoster: movie.poster_path ? getTMDBImageUrl(movie.poster_path, 'w500') : null
                }))

                return { ...category, movies }
            } catch (error) {
                console.error(`Error fetching ${category.title}:`, error)
                return { ...category, movies: [] }
            }
        })
    )

    return results
}

// Get proxied image URL (fallback)
export const getProxiedImageUrl = (posterUrl) => {
    if (!posterUrl || posterUrl === 'N/A' || posterUrl === '') {
        return null
    }
    // Use TMDB images directly (no CORS issues)
    if (posterUrl.includes('tmdb.org')) {
        return posterUrl
    }
    // For other URLs, use proxy
    return `/api/proxy-image?url=${encodeURIComponent(posterUrl)}`
}

// Legacy support
export const getCategoryMovies = async (query, page = 1) => {
    return searchMovies(query, page)
}

export const movieCategories = []
export const getPopularMovies = async () => {
    return getPopularMoviesTMDB()
}
