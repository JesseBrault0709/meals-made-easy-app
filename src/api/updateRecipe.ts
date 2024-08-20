import AccessToken from '../types/AccessToken'
import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'
import {
    GetRecipeViewWithRawText,
    RawGetRecipeViewWithRawText,
    toGetRecipeViewWithRawText
} from './types/GetRecipeView'
import UpdateRecipeSpec from './types/UpdateRecipeSpec'
import { addBearer } from './util'

export interface UpdateRecipeDeps {
    spec: UpdateRecipeSpec
    accessToken: AccessToken
    username: string
    slug: string
}

const updateRecipe = async ({
    spec,
    accessToken,
    username,
    slug
}: UpdateRecipeDeps): Promise<GetRecipeViewWithRawText> => {
    const headers = new Headers()
    addBearer(headers, accessToken)
    headers.set('Content-type', 'application/json')
    const response = await fetch(import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}`, {
        headers,
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(spec)
    })
    if (response.ok) {
        return toGetRecipeViewWithRawText((await response.json()) as RawGetRecipeViewWithRawText)
    } else if (response.status === 401) {
        throw new ExpiredTokenError()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default updateRecipe
