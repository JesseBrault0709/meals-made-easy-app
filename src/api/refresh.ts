import { ApiError } from './ApiError'
import LoginView, { RawLoginView } from './types/LoginView'

export class ExpiredRefreshTokenError extends ApiError {
    constructor() {
        super(401, 'Expired refresh token.')
        Object.setPrototypeOf(this, ExpiredRefreshTokenError.prototype)
    }
}

const refresh = async (): Promise<LoginView> => {
    let response: Response
    try {
        response = await fetch(
            import.meta.env.VITE_MME_API_URL + '/auth/refresh',
            {
                credentials: 'include',
                method: 'POST',
                mode: 'cors'
            }
        )
    } catch (fetchError) {
        if (fetchError instanceof TypeError) {
            throw fetchError // rethrow network issues
        } else {
            throw new Error(`Unknown fetch error: ${fetchError}`)
        }
    }
    if (response.ok) {
        const {
            username,
            accessToken,
            expires: rawExpires
        } = (await response.json()) as RawLoginView
        return {
            username,
            accessToken,
            expires: new Date(rawExpires)
        }
    } else if (response.status === 401) {
        throw new ExpiredRefreshTokenError()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default refresh
