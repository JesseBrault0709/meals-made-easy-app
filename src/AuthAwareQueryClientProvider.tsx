import {
    QueryCache,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'
import React, { useState } from 'react'
import ExpiredTokenError from './api/ExpiredTokenError'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useAuth } from './auth'
import refresh from './api/refresh'
import { useNavigate } from '@tanstack/react-router'

const AuthAwareQueryClientProvider = ({
    children
}: React.PropsWithChildren) => {
    const { putToken } = useAuth()
    const navigate = useNavigate()
    const [currentlyRefreshing, setCurrentlyRefreshing] = useState(false)

    const doRefresh = async () => {
        if (!currentlyRefreshing) {
            console.log('starting refresh')
            setCurrentlyRefreshing(true)
            const refreshResult = await refresh()
            if (refreshResult._tag === 'success') {
                console.log('refresh success, putting token...')
                putToken(
                    refreshResult.loginView.accessToken,
                    refreshResult.loginView.username
                )
            } else {
                console.error(`refresh failure: ${refreshResult.error}`)
                navigate({ to: '/login' }) // not working
            }
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
