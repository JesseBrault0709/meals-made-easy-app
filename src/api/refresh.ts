import { ApiError } from './ApiError'
import LoginExceptionView from './types/LoginExceptionView'
import LoginView, { RawLoginView } from './types/LoginView'

export type RefreshTokenErrorReason = 'INVALID_REFRESH_TOKEN' | 'EXPIRED_REFRESH_TOKEN' | 'NO_REFRESH_TOKEN'

export class RefreshTokenError extends ApiError {
    constructor(public reason: RefreshTokenErrorReason) {
        super(401, 'Refresh token error.')
        Object.setPrototypeOf(this, RefreshTokenError.prototype)
    }
}

const refresh = async (): Promise<LoginView> => {
    let response: Response
    try {
        response = await fetch(import.meta.env.VITE_MME_API_URL + '/auth/refresh', {
            credentials: 'include',
            method: 'POST',
            mode: 'cors'
        })
    } catch (fetchError) {
        if (fetchError instanceof TypeError) {
            throw fetchError // rethrow network issues
        } else {
            throw new Error(`Unknown fetch error: ${fetchError}`)
        }
    }
    if (response.ok) {
        const { username, accessToken, expires: rawExpires } = (await response.json()) as RawLoginView
        return {
            username,
            accessToken,
            expires: new Date(rawExpires)
        }
    } else if (response.status === 401) {
        const { reason } = (await response.json()) as LoginExceptionView
        throw new RefreshTokenError(reason as RefreshTokenErrorReason)
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default refresh
