export type LoginResult = LoginSuccess | LoginFailure

export interface LoginSuccess {
    _tag: 'success'
    loginView: LoginView
}
export interface LoginFailure {
    _tag: 'failure'
    error: string
}

export interface RawLoginView {
    username: string
    accessToken: string
    expires: string
}

interface LoginView {
    username: string
    accessToken: string
    expires: Date
}

export default LoginView
