import { useNavigate, useRouter } from '@tanstack/react-router'
import { useAuth } from '../../auth'
import classes from './header.module.css'

const Header = () => {
    const auth = useAuth()
    const router = useRouter()
    const navigate = useNavigate()

    const onLogout = async () => {
        auth.clearToken(async () => {
            await router.invalidate()
            await navigate({ to: '/login' })
        })
    }

    return (
        <header>
            <h1 className={classes.mealsMadeEasy}>Meals Made Easy</h1>
            <nav>
                <button onClick={onLogout}>Logout</button>
            </nav>
        </header>
    )
}

export default Header
