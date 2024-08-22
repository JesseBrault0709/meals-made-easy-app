import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import apiCallFactory from './apiCallFactory'
import GetRecipeView, {
    GetRecipeViewWithRawText,
    toGetRecipeView,
    toGetRecipeViewWithRawText
} from './types/GetRecipeView'

export interface GetRecipeCommonDeps {
    accessToken: AccessToken | null
    refresh: Refresh
    slug: string
    signal: AbortSignal
    username: string
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

const doGetRecipe = apiCallFactory('GET', toGetRecipeView)
const doGetRecipeIncludeRawText = apiCallFactory('GET', toGetRecipeViewWithRawText)

const getRecipe = (async ({
    accessToken,
    includeRawText,
    refresh,
    slug,
    signal,
    username
}: GetRecipeDeps | GetRecipeDepsIncludeRawText): Promise<GetRecipeView | GetRecipeViewWithRawText> => {
    const endpoint = `/recipes/${username}/${slug}`
    if (includeRawText) {
        return doGetRecipeIncludeRawText({
            accessToken,
            endpoint,
            query: 'includeRawText=true',
            refresh,
            signal
        })
    } else {
        return doGetRecipe({
            accessToken,
            endpoint,
            refresh,
            signal
        })
    }
}) as GetRecipe

export default getRecipe
