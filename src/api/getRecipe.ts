import { notFound, redirect } from '@tanstack/react-router'
import { AuthContextType } from '../auth'
import { ApiError } from './ApiError'
import FullRecipeView, {
    RawFullRecipeView,
    toFullRecipeView
} from './types/FullRecipeView'
import LoginView from './types/LoginView'
import SecurityExceptionView from './types/SecurityExceptionView'

export interface GetRecipeDeps {
    authContext: AuthContextType
    username: string
    slug: string
    abortSignal: AbortSignal
}

const getRecipe = async (
    { authContext, username, slug, abortSignal }: GetRecipeDeps,
    isRetry: boolean = false
): Promise<FullRecipeView> => {
    const headers = new Headers()
    if (authContext.token !== null) {
        headers.set('Authorization', `Bearer ${authContext.token}`)
    }
    const response = await fetch(
        import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}`,
        {
            signal: abortSignal,
            headers,
            mode: 'cors'
        }
    )
    if (response.ok) {
        return toFullRecipeView((await response.json()) as RawFullRecipeView)
    } else if (response.status === 401 && !isRetry) {
        // must be logged in to view this resource
        const securityExceptionView =
            (await response.json()) as SecurityExceptionView
        if (securityExceptionView.action === 'REFRESH') {
            // do refresh
            const refreshResponse = await fetch(
                import.meta.env.VITE_MME_API_URL + '/auth/refresh',
                {
                    signal: abortSignal,
                    method: 'POST'
                }
            )
            if (refreshResponse.ok) {
                const { accessToken, username } =
                    (await refreshResponse.json()) as LoginView
                authContext.putToken(accessToken, username)
                return getRecipe(
                    {
                        abortSignal,
                        authContext,
                        slug,
                        username
                    },
                    true
                )
            } else {
                throw new ApiError(
                    refreshResponse.status,
                    refreshResponse.statusText
                )
            }
        } else {
            // do login
            throw redirect({ to: '/login' })
        }
    } else if (response.status === 404) {
        // no such resource
        throw notFound()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipe
