import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface RecipeCardProps {
    title: string
    ownerUsername: string
    mainImageUrl: string
    starCount: number
    isPublic: boolean
}

const RecipeCard = ({
    title,
    ownerUsername,
    mainImageUrl,
    starCount,
    isPublic
}: RecipeCardProps) => {
    return (
        <article>
            <img src={mainImageUrl} />
            <div className="title-star-count-container">
                <h1>{title}</h1>
                <span>
                    <FontAwesomeIcon icon="star" size="sm" />
                    {starCount}
                </span>
            </div>
            <div className="owner-container">
                <span>
                    <FontAwesomeIcon icon="user" />
                    {ownerUsername}
                </span>
            </div>
            <div className="is-public-container">
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
