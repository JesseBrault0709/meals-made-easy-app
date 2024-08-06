import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import RouterContext from '../RouterContext'
import { useAuth } from '../auth'
import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import './__root.module.css'

const RootLayout = () => {
    const { username } = useAuth()

    return (
        <>
            <Header username={username ?? undefined} />
            <main>
                <Outlet />
            </main>
            <Footer />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout
})
