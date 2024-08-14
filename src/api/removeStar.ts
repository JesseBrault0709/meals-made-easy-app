import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'

export interface RemoveStarDeps {
    token: string
    username: string
    slug: string
}

const removeStar = async ({ token, username, slug }: RemoveStarDeps) => {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${token}`)
    const response = await fetch(import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}/star`, {
        headers,
        method: 'DELETE',
        mode: 'cors'
    })
    if (response.status === 401) {
        throw new ExpiredTokenError()
    } else if (!response.ok) {
        throw new ApiError(response.status, response.statusText)
    }
}

export default removeStar
