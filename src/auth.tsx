import React, { createContext, useContext, useEffect, useState } from 'react'

export interface AuthContextType {
    token: string | null
    putToken(token: string, cb?: () => void): void
    clearToken(cb?: () => void): void
}

interface AuthState {
    token: string | null
    putCb?: () => void
    clearCb?: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    const [authState, setAuthState] = useState<AuthState>({ token: null })

    useEffect(() => {
        if (authState.token === null && authState.clearCb !== undefined) {
            authState.clearCb()
            setAuthState({ ...authState, clearCb: undefined })
        } else if (authState.token !== null && authState.putCb !== undefined) {
            authState.putCb()
            setAuthState({ ...authState, putCb: undefined })
        }
    }, [authState.token])

    return (
        <AuthContext.Provider
            value={{
                token: authState.token,
                putToken(token, cb) {
                    setAuthState({
                        token,
                        putCb: cb
                    })
                },
                clearToken(cb) {
                    setAuthState({
                        token: null,
                        clearCb: cb
                    })
                }
            }}
        >
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
