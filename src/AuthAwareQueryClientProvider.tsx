import {
    QueryCache,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useLocation, useNavigate } from '@tanstack/react-router'
import React, { useState } from 'react'
import ExpiredTokenError from './api/ExpiredTokenError'
import refresh, { ExpiredRefreshTokenError } from './api/refresh'
import LoginView from './api/types/LoginView'
import { useAuth } from './auth'

const AuthAwareQueryClientProvider = ({
    children
}: React.PropsWithChildren) => {
    const { putToken, clearToken } = useAuth()
    const navigate = useNavigate()
    const [currentlyRefreshing, setCurrentlyRefreshing] = useState(false)
    const { href } = useLocation()

    const doRefresh = async () => {
        if (!currentlyRefreshing) {
            console.log('starting refresh')
            setCurrentlyRefreshing(true)
            let refreshResult: LoginView
            try {
                refreshResult = await refresh()
            } catch (error) {
                if (error instanceof ExpiredRefreshTokenError) {
                    console.log('refresh-token expired')
                    setCurrentlyRefreshing(false)
                    clearToken()
                    await navigate({
                        to: '/login',
                        search: {
                            expired: true,
                            redirect: href
                        }
                    })
                    console.log('post-navigate')
                    return
                } else {
                    setCurrentlyRefreshing(false)
                    throw error
                }
            }
            putToken(refreshResult.accessToken, refreshResult.username)
            setCurrentlyRefreshing(false)
            console.log('refresh done')
        }
    }

    const [queryClient] = useState<QueryClient>(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retryDelay(failureCount, error) {
                            if (error instanceof ExpiredTokenError) {
                                return 0
                            } else {
                                return failureCount * 1000
                            }
                        }
                    }
                },
                queryCache: new QueryCache({
                    onError(error) {
                        if (error instanceof ExpiredTokenError) {
                            console.error(error.message)
                            doRefresh()
                        }
                    }
                })
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools position="right" buttonPosition="top-right" />
        </QueryClientProvider>
    )
}

export default AuthAwareQueryClientProvider
