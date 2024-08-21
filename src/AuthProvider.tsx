import { createContext, PropsWithChildren, useContext, useReducer } from 'react'
import AccessToken from './types/AccessToken'

export interface AuthContextType {
    accessToken: AccessToken | null
    putToken: (token: AccessToken | null) => void
}

interface AuthReducerState {
    accessToken: AccessToken | null
}

const initialState: AuthReducerState = {
    accessToken: null
}

type AuthReducerAction = PutTokenAction | ClearTokenAction

interface PutTokenAction {
    tag: 'putToken'
    accessToken: AccessToken
}

interface ClearTokenAction {
    tag: 'clearToken'
}

const authReducer = (_state: AuthReducerState, action: AuthReducerAction): AuthReducerState => {
    switch (action.tag) {
        case 'putToken':
            return { accessToken: action.accessToken }
        case 'clearToken':
            return { accessToken: null }
    }
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    return (
        <AuthContext.Provider
            value={{
                accessToken: state.accessToken,
                putToken: token => {
                    if (token === null) {
                        dispatch({ tag: 'clearToken' })
                    } else {
                        dispatch({ tag: 'putToken', accessToken: token })
                    }
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
