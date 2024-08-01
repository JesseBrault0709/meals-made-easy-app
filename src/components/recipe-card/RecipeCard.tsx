import { Link } from '@tanstack/react-router'
import RecipeVisibilityIcon from '../recipe-visibility-icon/RecipeVisibilityIcon'
import StarCount from '../star-count/StarCount'
import UserIconAndName from '../user-icon-and-name/UserIconAndName'
import classes from './recipe-card.module.css'

export interface RecipeCardProps {
    title: string
    ownerUsername: string
    slug: string
    mainImageUrl: string
    mainImageAlt?: string
    starCount: number
    isPublic: boolean
}

const RecipeCard = ({
    title,
    ownerUsername,
    slug,
    mainImageUrl,
    mainImageAlt,
    starCount,
    isPublic
}: RecipeCardProps) => {
    return (
        <article className={classes.recipeCard}>
            <Link
                to="/recipes/$username/$slug"
                params={{
                    username: ownerUsername,
                    slug
                }}
            >
                <img
                    className={classes.recipeImage}
                    src={mainImageUrl}
                    alt={mainImageAlt}
                    title={mainImageAlt}
                />
            </Link>
            <div className={classes.infoContainer}>
                <div className={classes.infoRow}>
                    <Link
                        className={classes.titleLink}
                        to="/recipes/$username/$slug"
                        params={{
                            username: ownerUsername,
                            slug
                        }}
                    >
                        <h1 className={classes.title}>{title}</h1>
                    </Link>
                    <StarCount count={starCount} />
                </div>
                <div className={classes.infoRow}>
                    <UserIconAndName username={ownerUsername} />
                    <RecipeVisibilityIcon isPublic={isPublic} />
                </div>
            </div>
        </article>
    )
}

export default RecipeCard
