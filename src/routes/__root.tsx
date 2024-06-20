import {
    Outlet,
    createRootRouteWithContext,
    useRouteContext,
    useRouter
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import RouterContext from '../RouterContext'

const RootLayout = () => {
    const logout = useRouteContext({
        from: '__root__',
        select: s => s.auth.logout
    })
    const router = useRouter()

    const onLogout = async () => {
        logout()
        await router.invalidate()
        router.navigate({ to: '/login' })
    }

    return (
        <>
            <div>
                <h1>Hello, World.</h1>
                <button onClick={onLogout}>Logout</button>
                <Outlet />
            </div>
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout
})
