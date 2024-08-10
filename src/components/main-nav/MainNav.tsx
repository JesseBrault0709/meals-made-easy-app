import { Link } from '@tanstack/react-router'
import classes from './main-nav.module.css'

const MainNav = () => {
    return (
        <nav className={classes.mainNav}>
            <Link to="/recipes" className={classes.mainNavLink}>
                Browse Recipes
            </Link>
            <Link to="/login" className={classes.mainNavLink}>
                Login
            </Link>
        </nav>
    )
}

export default MainNav
