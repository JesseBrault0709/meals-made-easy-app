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
