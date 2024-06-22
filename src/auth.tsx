import React, { useContext, createContext, useState } from 'react'

export interface AuthContextType {
    token: string | null
    error: string | null
    login(username: string, password: string): Promise<boolean>
    logout(): void
}

interface LoginView {
    username: string
    accessToken: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const login: AuthContextType['login'] = async (username, password) => {
        try {
            const response = await fetch(
                import.meta.env.VITE_MME_API_URL + '/auth/login',
                {
                    body: JSON.stringify({ username, password }),
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    mode: 'cors'
                }
            )
            if (response.ok) {
                const body = (await response.json()) as LoginView
                setToken(body.accessToken)
                setError(null)
                return true
            } else {
                setToken(null)
                if (response.status === 401) {
                    setError('Invalid username or password.')
                } else if (response.status === 500) {
                    setError(
                        'There was an internal server error. Please try again later.'
                    )
                } else {
                    setError('Unknown error.')
                    console.error(
                        `Unknown error: ${response.status} ${response.statusText}`
                    )
                }
                return false
            }
        } catch (fetchError) {
            setError('Network error. Please try again later.')
            console.error(`Unknown error: ${fetchError}`)
            return false
        }
    }

    const logout: AuthContextType['logout'] = () => {
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    if (!auth) {
        throw new Error('useAuth must be used in an AuthProvider context')
    }
    return auth
}
