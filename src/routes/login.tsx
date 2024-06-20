import {
    createFileRoute,
    redirect,
    useRouteContext,
    useRouter,
    useSearch
} from '@tanstack/react-router'
import { z } from 'zod'

const Login = () => {
    const login = useRouteContext({ from: '/login', select: s => s.auth.login })
    const router = useRouter()
    const search = useSearch({ from: '/login' })

    const onLogin = async () => {
        login()
        await router.invalidate()
        router.navigate({ to: search.redirect || '/' })
    }

    return (
        <div>
            <h2>Login Page</h2>
            <button onClick={onLogin}>Login</button>
        </div>
    )
}

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch('')
    }),
    beforeLoad({ context, search }) {
        if (context.auth.isAuthenticated) {
            throw redirect({ to: search.redirect || '/' })
        }
    },
    component: Login
})
