import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { z } from 'zod'
import login from '../api/login'
import { useAuth } from '../AuthProvider'

const Login = () => {
    const { putToken } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { redirect, reason } = useSearch({ from: '/login' })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const username = (formData.get('username') as string | null) ?? ''
        const password = (formData.get('password') as string | null) ?? ''
        const loginResult = await login(username, password)
        if (loginResult._tag === 'success') {
            const { accessToken: token, expires, username } = loginResult.loginView
            putToken({
                token,
                expires,
                username
            })
            navigate({
                to: redirect ?? '/recipes',
                search: {}
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
        reason: z
            .enum([
                'INVALID_REFRESH_TOKEN',
                'EXPIRED_REFRESH_TOKEN',
                'NO_REFRESH_TOKEN',
                'NOT_LOGGED_IN',
                'EXPIRED_ACCESS_TOKEN'
            ])
            .optional(),
        redirect: z.string().optional().catch('')
    }),
    component: Login
})
