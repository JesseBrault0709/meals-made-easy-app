import { createFileRoute, redirect, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { z } from 'zod'
import login from '../api/login'
import { useAuth } from '../auth'

const Login = () => {
    const auth = useAuth()
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const navigate = useNavigate()
    const { redirect, expired } = useSearch({ from: '/login' })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = (formData.get('username') as string | null) ?? ''
        const password = (formData.get('password') as string | null) ?? ''
        const loginResult = await login(username, password)
        if (loginResult._tag === 'success') {
            auth.putToken(loginResult.loginView.accessToken, loginResult.loginView.username, async () => {
                await router.invalidate()
                await navigate({
                    to: redirect ?? '/recipes',
                    search: {}
                })
            })
        } else {
            setError(loginResult.error)
        }
    }

    return (
        <div>
            <h2>Login Page</h2>
            {expired ? <p>Your session has expired. Please login again.</p> : null}
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
        expired: z.boolean().optional().catch(false),
        redirect: z.string().optional().catch('')
    }),
    beforeLoad({ context, search }) {
        if (!(search.expired || context.auth.token === null)) {
            throw redirect({ to: '/recipes' })
        }
    },
    component: Login
})
