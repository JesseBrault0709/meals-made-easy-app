import { useRouter } from '@tanstack/react-router'
import { createContext, useContext, PropsWithChildren, useRef, useCallback } from 'react'
import { ApiError } from './api/ApiError'
import refresh, { RefreshTokenError } from './api/refresh'
import { useAuth } from './AuthProvider'
import Refresh from './types/Refresh'

export interface RefreshContextType {
    refresh: Refresh
}

const RefreshContext = createContext<RefreshContextType | null>(null)

export const useRefresh = () => {
    const refreshContext = useContext(RefreshContext)
    if (refreshContext === null) {
        throw new Error('refreshContext is null')
    }
    return refreshContext.refresh
}

const RefreshProvider = ({ children }: PropsWithChildren) => {
    const { putToken } = useAuth()
    const router = useRouter()
    const refreshing = useRef(false)

    const doRefresh: Refresh = useCallback(async () => {
        putToken(null)
        if (!refreshing.current) {
            refreshing.current = true
            try {
                const { accessToken: token, expires, username } = await refresh()
                putToken({
                    token,
                    expires,
                    username
                })
                refreshing.current = false
                return {
                    token,
                    expires,
                    username
                }
            } catch (error) {
                if (error instanceof RefreshTokenError) {
                    router.navigate({
                        to: '/login',
                        search: {
                            reason: error.reason,
                            redirect: router.state.location.href
                        }
                    })
                } else if (error instanceof ApiError) {
                    console.error(error)
                }
                refreshing.current = false
            }
        }
        return null
    }, [putToken, router])

    return (
        <RefreshContext.Provider
            value={{
                refresh: doRefresh
            }}
        >
            {children}
        </RefreshContext.Provider>
    )
}

export default RefreshProvider
