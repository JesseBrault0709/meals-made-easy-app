import { ApiError } from './ApiError'

class ExpiredTokenError extends ApiError {
    constructor() {
        super(401, 'Expired Access Token (ExpiredTokenError)')
        Object.setPrototypeOf(this, ExpiredTokenError.prototype)
    }
}

export default ExpiredTokenError
