interface SecurityExceptionView {
    status: number
    action: 'REFRESH' | 'LOGIN'
    message: string
}

export default SecurityExceptionView
