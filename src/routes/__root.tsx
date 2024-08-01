import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import RouterContext from '../RouterContext'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import './__root.module.css'

const RootLayout = () => {
    return (
        <>
            <Header />
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
