import {
    createFileRoute,
    redirect,
    useRouteContext,
    useRouter,
    useSearch
} from '@tanstack/react-router'
import { FormEvent } from 'react'
import { z } from 'zod'

const Login = () => {
    const login = useRouteContext({ from: '/login', select: s => s.auth.login })
    const error = useRouteContext({ from: '/login', select: s => s.auth.error })
    const router = useRouter()
    const search = useSearch({ from: '/login' })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = (formData.get('username') as string | null) ?? ''
        const password = (formData.get('password') as string | null) ?? ''
        const success = await login(username, password)
        if (success) {
            await router.invalidate()
            router.navigate({ to: search.redirect || '/' })
        }
    }

    return (
        <div>
            <h2>Login Page</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" />

                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />

                <input type="submit" />

                {error ? <p>{error}</p> : <p> </p>}
            </form>
        </div>
    )
}

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch('')
    }),
    beforeLoad({ context, search }) {
        if (context.auth.token) {
            throw redirect({ to: search.redirect || '/' })
        }
    },
    component: Login
})
