import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Use empty string for local dev (Vite proxy), or VITE_API_URL for production
const API_BASE = ''

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [myList, setMyList] = useState([])

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token')

            if (storedToken) {
                try {
                    const response = await fetch(`${API_BASE}/api/auth/user`, {
                        headers: {
                            'x-auth-token': storedToken
                        }
                    })

                    const data = await response.json()

                    if (response.ok) {
                        setUser(data)
                        setToken(storedToken)
                        setIsAuthenticated(true)
                        // Load my list
                        if (data.myList) {
                            setMyList(data.myList)
                        }
                    } else {
                        localStorage.removeItem('token')
                        setToken(null)
                    }

                } catch (error) {
                    console.error('Auth initialization error:', error)
                    localStorage.removeItem('token')
                    setToken(null)
                }
            }

            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Login failed')
        }

        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
        setIsAuthenticated(true)

        return data
    }

    const register = async (username, email, password) => {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed')
        }

        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
        setIsAuthenticated(true)

        return data
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        setMyList([])
    }

    // Add movie to my list
    const addToMyList = async (movie) => {
        if (!token) return { message: 'Please login first' }

        try {
            const response = await fetch(`${API_BASE}/api/auth/myList/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(movie)
            })

            const data = await response.json()

            if (response.ok) {
                setMyList(data.myList)
            }

            return data
        } catch (error) {
            console.error('Add to list error:', error)
            return { message: 'Error adding to list' }
        }
    }

    // Remove movie from my list
    const removeFromMyList = async (imdbID) => {
        if (!token) return { message: 'Please login first' }

        try {
            const response = await fetch(`${API_BASE}/api/auth/myList/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ imdbID })
            })

            const data = await response.json()

            if (response.ok) {
                setMyList(data.myList)
            }

            return data
        } catch (error) {
            console.error('Remove from list error:', error)
            return { message: 'Error removing from list' }
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            myList,
            addToMyList,
            removeFromMyList
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}
