import AccessToken from '../types/AccessToken'
import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'
import { addBearer } from './util'

export interface AddStarDeps {
    accessToken: AccessToken
    username: string
    slug: string
}

const addStar = async ({ slug, accessToken, username }: AddStarDeps): Promise<void> => {
    const headers = new Headers()
    addBearer(headers, accessToken)
    const response = await fetch(import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}/star`, {
        headers,
        method: 'POST',
        mode: 'cors'
    })
    if (response.status === 401) {
        throw new ExpiredTokenError()
    } else if (!response.ok) {
        throw new ApiError(response.status, response.statusText)
    }
}

export default addStar
