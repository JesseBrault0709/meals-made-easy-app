import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './recipe-card.module.css'
import { Link } from '@tanstack/react-router'

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
                <h1 className={classes.title}>{title}</h1>
                <span>
                    <FontAwesomeIcon icon="star" size="sm" />
                    {starCount}
                </span>
                <span>
                    <FontAwesomeIcon icon="user" />
                    {ownerUsername}
                </span>
                {isPublic ? (
                    <FontAwesomeIcon icon="globe" size="sm" />
                ) : (
                    <FontAwesomeIcon icon="lock" size="sm" />
                )}
            </div>
        </article>
    )
}

export default RecipeCard
