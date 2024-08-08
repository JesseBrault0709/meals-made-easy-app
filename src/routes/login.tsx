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
    const { redirect, reason } = useSearch({ from: '/login' })

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

    let message: string | null = null
    if (reason !== undefined) {
        if (reason === 'INVALID_REFRESH_TOKEN' || reason === 'EXPIRED_REFRESH_TOKEN') {
            message = 'Your session has expired. Please login again.'
        } else {
            message = 'Please login to view this page.'
        }
    }

    return (
        <div>
            <h2>Login Page</h2>
            {message !== null ? <p>{message}</p> : null}
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
        reason: z.enum(['INVALID_REFRESH_TOKEN', 'EXPIRED_REFRESH_TOKEN', 'NO_REFRESH_TOKEN']).optional(),
        redirect: z.string().optional().catch('')
    }),
    beforeLoad({ context, search }) {
        if (search.reason === undefined && context.auth.token !== null) {
            throw redirect({ to: '/recipes' })
        }
    },
    component: Login
})
