import { createContext, PropsWithChildren, useContext, useState } from 'react'
import AccessToken from './types/AccessToken'

export interface AuthContextType {
    accessToken: AccessToken | null
    putToken: (token: AccessToken | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [accessToken, setAccessToken] = useState<AccessToken | null>(null)
    return (
        <AuthContext.Provider
            value={{
                accessToken,
                putToken: token => {
                    console.log(`token: ${token !== null ? token.token : null}`)
                    setAccessToken(token)
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
