import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Use relative path for API calls (works with Vite proxy)
const API_BASE = ''

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

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
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            loading,
            login,
            register,
            logout
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
