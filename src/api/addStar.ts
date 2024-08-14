import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'

export interface AddStarDeps {
    token: string
    username: string
    slug: string
}

const addStar = async ({ slug, token, username }: AddStarDeps): Promise<void> => {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${token}`)
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
