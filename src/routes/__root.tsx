import {
    Outlet,
    createRootRouteWithContext,
    useNavigate,
    useRouter
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import RouterContext from '../RouterContext'
import { useAuth } from '../auth'

const RootLayout = () => {
    const auth = useAuth()
    const router = useRouter()
    const navigate = useNavigate()

    const onLogout = async () => {
        auth.clearToken(async () => {
            await router.invalidate()
            await navigate({ to: '/login' })
        })
    }

    return (
        <>
            <header>
                <h1>Meals Made Easy</h1>
                <nav>
                    <button onClick={onLogout}>Logout</button>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>Copyright 2024 Jesse R. Brault. All rights reserved.</p>
            </footer>
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout
})
