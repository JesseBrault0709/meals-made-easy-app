import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Router, RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiError } from './api/ApiError'
import ExpiredTokenError from './api/ExpiredTokenError'
import { AuthProvider, useAuth } from './AuthProvider'
import './main.css'
import { routeTree } from './routeTree.gen'
import RefreshProvider from './RefreshProvider'

// Font-Awesome: load icons
library.add(fas)

// Create router
// Type must be explicitly annotated otherwise TS complains
const router: Router<typeof routeTree, 'preserve'> = createRouter({
    context: {
        auth: undefined!
    },
    routeTree
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry(failureCount, error) {
                if (error instanceof ExpiredTokenError || (error instanceof ApiError && error.status === 404)) {
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
    }
})

const InnerApp = () => {
    const auth = useAuth()
    return (
        <RouterProvider
            router={router}
            context={{ auth }}
            InnerWrap={({ children }) => (
                <QueryClientProvider client={queryClient}>
                    <RefreshProvider>
                        {children}
                        <ReactQueryDevtools position="right" buttonPosition="top-right" />
                    </RefreshProvider>
                </QueryClientProvider>
            )}
        ></RouterProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    </React.StrictMode>
)
