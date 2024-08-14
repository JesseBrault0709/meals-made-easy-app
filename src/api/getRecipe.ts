import { AuthContextType } from '../auth'
import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'
import FullRecipeView, { RawFullRecipeView, toFullRecipeView } from './types/FullRecipeView'
import GetRecipeView, { RawGetRecipeView, toGetRecipeView } from './types/GetRecipeView'

export interface GetRecipeDeps {
    authContext: AuthContextType
    username: string
    slug: string
    abortSignal: AbortSignal
}

const getRecipe = async ({ authContext, username, slug, abortSignal }: GetRecipeDeps): Promise<GetRecipeView> => {
    const headers = new Headers()
    if (authContext.token !== null) {
        headers.set('Authorization', `Bearer ${authContext.token}`)
    }
    const response = await fetch(import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}`, {
        signal: abortSignal,
        headers,
        mode: 'cors'
    })
    if (response.ok) {
        return toGetRecipeView((await response.json()) as RawGetRecipeView)
    } else if (response.status === 401) {
        throw new ExpiredTokenError()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipe
