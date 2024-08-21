import { useLocation, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../AuthProvider'
import classes from './header.module.css'

export interface HeaderProps {
    username?: string
}

const Header = ({ username }: HeaderProps) => {
    const { putToken } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const onLogin = () => {
        navigate({ to: '/login', search: { redirect: location.href } })
    }

    const onLogout = () => {
        putToken(null)
        navigate({ to: '/login' })
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
