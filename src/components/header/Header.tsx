import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { useAuth } from '../../auth'
import classes from './header.module.css'

export interface HeaderProps {
    username?: string
}

const Header = ({ username }: HeaderProps) => {
    const auth = useAuth()
    const router = useRouter()
    const navigate = useNavigate()
    const location = useLocation()

    const onLogin = async () => {
        navigate({ to: '/login', search: { redirect: location.href } })
    }

    const onLogout = async () => {
        auth.clearToken(async () => {
            await router.invalidate()
            await navigate({ to: '/login' })
        })
    }

    return (
        <header>
            <h1 className={classes.mealsMadeEasy}>Meals Made Easy</h1>
            <div className={classes.right}>
                {username !== undefined ? (
                    <>
                        <p>Logged in as: {username}</p>
                        <button onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <p>Not logged in.</p>
                        <button onClick={onLogin}>Login</button>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
