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
            {mainImageUrl ? <img src={mainImageUrl} /> : null}
            <div className="title-star-count-container">
                <h1>{title}</h1>
                {starCount ? (
                    <span>
                        <FontAwesomeIcon icon="star" size="sm" />
                        {starCount}
                    </span>
                ) : null}
            </div>
            <div className="owner-container">
                {ownerUsername ? <p>{ownerUsername}</p> : null}
            </div>
            <div className="is-public-container">
                {isPublic !== undefined ? (
                    isPublic ? (
                        <FontAwesomeIcon icon="globe" size="sm" />
                    ) : (
                        <FontAwesomeIcon icon="lock" size="sm" />
                    )
                ) : null}
            </div>
        </article>
    )
}

export default RecipeCard
