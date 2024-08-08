import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'

export interface GetImageDeps {
    accessToken: string | null
    signal: AbortSignal
    url: string
}

const getImage = async ({
    accessToken,
    signal,
    url
}: GetImageDeps): Promise<string> => {
    const headers = new Headers()
    if (accessToken !== null) {
        headers.set('Authorization', `Bearer ${accessToken}`)
    }
    const response = await fetch(url, {
        headers,
        mode: 'cors',
        signal
    })
    if (response.ok) {
        return URL.createObjectURL(await response.blob())
    } else if (response.status === 401) {
        throw new ExpiredTokenError()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getImage
