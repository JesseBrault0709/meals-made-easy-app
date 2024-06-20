import React, { useContext, createContext, useState } from 'react'

export interface AuthContextType {
    isAuthenticated: boolean
    login(): void
    logout(): void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login: AuthContextType['login'] = () => {
        setIsAuthenticated(true)
    }

    const logout: AuthContextType['logout'] = () => {
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
