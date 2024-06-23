import {
    createFileRoute,
    redirect,
    useNavigate,
    useRouter,
    useSearch
} from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { z } from 'zod'
import login from '../api/login'
import { useAuth } from '../auth'

const Login = () => {
    const auth = useAuth()
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const navigate = useNavigate()
    const search = useSearch({ from: '/login' })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = (formData.get('username') as string | null) ?? ''
        const password = (formData.get('password') as string | null) ?? ''
        const loginResult = await login(username, password)
        if (loginResult._tag === 'success') {
            auth.putToken(loginResult.loginView.accessToken, async () => {
                await router.invalidate()
                await navigate({ to: search.redirect ?? '/' })
            })
        } else {
            setError(loginResult.error)
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
