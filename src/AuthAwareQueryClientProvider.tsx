import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouter } from '@tanstack/react-router'
import React, { useState } from 'react'
import { ApiError } from './api/ApiError'
import ExpiredTokenError from './api/ExpiredTokenError'
import refresh, { RefreshTokenError } from './api/refresh'
import LoginView from './api/types/LoginView'
import { useAuth } from './auth'

const AuthAwareQueryClientProvider = ({ children }: React.PropsWithChildren) => {
    const { putToken, clearToken } = useAuth()
    const router = useRouter()
    const [currentlyRefreshing, setCurrentlyRefreshing] = useState(false)

    const doRefresh = async () => {
        if (!currentlyRefreshing) {
            console.log('starting refresh')
            setCurrentlyRefreshing(true)
            let refreshResult: LoginView
            try {
                refreshResult = await refresh()
            } catch (error) {
                if (error instanceof RefreshTokenError) {
                    console.log(`RefreshTokenError: ${error.reason}`)
                    setCurrentlyRefreshing(false)
                    clearToken()
                    await router.navigate({
                        to: '/login',
                        search: {
                            reason: error.reason,
                            redirect: router.state.location.href
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
                        retry(failureCount, error) {
                            if (
                                error instanceof ExpiredTokenError ||
                                (error instanceof ApiError && error.status === 404)
                            ) {
                                return false
                            } else {
                                return failureCount <= 3
                            }
                        },
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
