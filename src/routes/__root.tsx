import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import RouterContext from '../RouterContext'
import { useAuth } from '../auth'
import Footer from '../components/footer/Footer'
import Header from '../components/header/Header'
import classes from './__root.module.css'
import MainNav from '../components/main-nav/MainNav'

const RootLayout = () => {
    const { username } = useAuth()

    return (
        <>
            <Header username={username ?? undefined} />
            <div className={classes.mainWrapper}>
                <MainNav />
                <main>
                    <Outlet />
                </main>
            </div>
            <Footer />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout
})
