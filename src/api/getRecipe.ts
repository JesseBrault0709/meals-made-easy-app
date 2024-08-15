import { AuthContextType } from '../auth'
import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'
import GetRecipeView, {
    GetRecipeViewWithRawText,
    RawGetRecipeView,
    RawGetRecipeViewWithRawText,
    toGetRecipeView,
    toGetRecipeViewWithRawText
} from './types/GetRecipeView'

export interface GetRecipeCommonDeps {
    authContext: AuthContextType
    username: string
    slug: string
    abortSignal: AbortSignal
}

export interface GetRecipeDeps extends GetRecipeCommonDeps {
    includeRawText?: false
}

export interface GetRecipeDepsIncludeRawText extends GetRecipeCommonDeps {
    includeRawText: true
}

export interface GetRecipe {
    (deps: GetRecipeDeps): Promise<GetRecipeView>
    (deps: GetRecipeDepsIncludeRawText): Promise<GetRecipeViewWithRawText>
}

const getRecipe = (async ({
    authContext,
    username,
    slug,
    abortSignal,
    includeRawText
}: GetRecipeDeps | GetRecipeDepsIncludeRawText): Promise<GetRecipeView | GetRecipeViewWithRawText> => {
    const headers = new Headers()
    if (authContext.token !== null) {
        headers.set('Authorization', `Bearer ${authContext.token}`)
    }
    const query = includeRawText ? '?includeRawText=true' : ''
    const response = await fetch(import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}${query}`, {
        signal: abortSignal,
        headers,
        mode: 'cors'
    })
    if (response.ok) {
        if (includeRawText) {
            return toGetRecipeViewWithRawText((await response.json()) as RawGetRecipeViewWithRawText)
        } else {
            return toGetRecipeView((await response.json()) as RawGetRecipeView)
        }
    } else if (response.status === 401) {
        throw new ExpiredTokenError()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}) as GetRecipe

export default getRecipe
