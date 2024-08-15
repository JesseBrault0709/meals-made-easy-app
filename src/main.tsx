import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { Router, RouterProvider, createRouter } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './auth'
import AuthAwareQueryClientProvider from './AuthAwareQueryClientProvider'
import './main.css'
import { routeTree } from './routeTree.gen'

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

const InnerApp = () => {
    const auth = useAuth()
    return (
        <RouterProvider
            router={router}
            context={{ auth }}
            InnerWrap={({ children }) => <AuthAwareQueryClientProvider>{children}</AuthAwareQueryClientProvider>}
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
