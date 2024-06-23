export type LoginResult = LoginSuccess | LoginFailure

export interface LoginSuccess {
    _tag: 'success'
    loginView: LoginView
}
export interface LoginFailure {
    _tag: 'failure'
    error: string
}

export interface LoginView {
    username: string
    accessToken: string
}

const login = async (
    username: string,
    password: string
): Promise<LoginResult> => {
    try {
        const response = await fetch(
            import.meta.env.VITE_MME_API_URL + '/auth/login',
            {
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                mode: 'cors'
            }
        )
        if (response.ok) {
            const loginView = (await response.json()) as LoginView
            return {
                _tag: 'success',
                loginView
            }
        } else {
            let error: string
            if (response.status === 401) {
                error = 'Invalid username or password.'
            } else if (response.status === 500) {
                error =
                    'There was an internal server error. Please try again later.'
            } else {
                error = 'Unknown error.'
                console.error(
                    `Unknown error: ${response.status} ${response.statusText}`
                )
            }
            return {
                _tag: 'failure',
                error
            }
        }
    } catch (fetchError) {
        console.error(`Unknown error: ${fetchError}`)
        return {
            _tag: 'failure',
            error: 'Network error. Please try again later.'
        }
    }
}

export default login
