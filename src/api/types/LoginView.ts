export type LoginResult = LoginSuccess | LoginFailure

export interface LoginSuccess {
    _tag: 'success'
    loginView: LoginView
}
export interface LoginFailure {
    _tag: 'failure'
    error: string
}

interface LoginView {
    username: string
    accessToken: string
}

export default LoginView
