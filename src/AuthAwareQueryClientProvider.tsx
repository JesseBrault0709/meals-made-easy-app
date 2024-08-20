import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouter } from '@tanstack/react-router'
import React, { useCallback, useMemo, useRef } from 'react'
import { ApiError } from './api/ApiError'
import ExpiredTokenError from './api/ExpiredTokenError'
import refresh, { RefreshTokenError } from './api/refresh'
import { useAuth } from './auth'

const AuthAwareQueryClientProvider = ({ children }: React.PropsWithChildren) => {
    const { putToken } = useAuth()
    const router = useRouter()
    const refreshing = useRef(false)

    const doRefresh = useCallback(async () => {
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
            }
            refreshing.current = false
        }
    }, [putToken, router])

    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    mutations: {
                        onError(error) {
                            if (error instanceof ExpiredTokenError) {
                                doRefresh()
                            }
                        }
                    },
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
            }),
        [doRefresh]
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools position="right" buttonPosition="top-right" />
        </QueryClientProvider>
    )
}

export default AuthAwareQueryClientProvider
