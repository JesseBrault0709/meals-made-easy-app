interface LoginExceptionView {
    reason: 'INVALID_CREDENTIALS' | 'INVALID_REFRESH_TOKEN' | 'EXPIRED_REFRESH_TOKEN' | 'NO_REFRESH_TOKEN'
    message: string
}

export default LoginExceptionView
