import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './auth'

// Create router
const router = createRouter({
    context: {
        auth: undefined!
    },
    routeTree
})

// Create queryClient
const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const InnerApp = () => {
    const auth = useAuth()
    return <RouterProvider router={router} context={{ auth }}></RouterProvider>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <InnerApp />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
