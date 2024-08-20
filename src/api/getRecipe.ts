import AccessToken from '../types/AccessToken'
import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'
import GetRecipeView, {
    GetRecipeViewWithRawText,
    RawGetRecipeView,
    RawGetRecipeViewWithRawText,
    toGetRecipeView,
    toGetRecipeViewWithRawText
} from './types/GetRecipeView'
import { addBearer } from './util'

export interface GetRecipeCommonDeps {
    accessToken: AccessToken | null
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
    accessToken,
    username,
    slug,
    abortSignal,
    includeRawText
}: GetRecipeDeps | GetRecipeDepsIncludeRawText): Promise<GetRecipeView | GetRecipeViewWithRawText> => {
    const headers = new Headers()
    if (accessToken !== null) {
        addBearer(headers, accessToken)
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
