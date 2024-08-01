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
                    <span className={classes.starInfo}>
                        <FontAwesomeIcon
                            icon="star"
                            className={classes.star}
                            size="sm"
                        />
                        {starCount}
                    </span>
                </div>
                <div className={classes.infoRow}>
                    <span className={classes.userInfo}>
                        <FontAwesomeIcon
                            icon="user"
                            className={classes.userIcon}
                        />
                        {ownerUsername}
                    </span>
                    {isPublic ? (
                        <FontAwesomeIcon icon="globe" size="sm" />
                    ) : (
                        <FontAwesomeIcon icon="lock" size="sm" />
                    )}
                </div>
            </div>
        </article>
    )
}

export default RecipeCard
