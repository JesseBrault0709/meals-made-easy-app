export interface RecipeCardProps {
    title: string
    owner?: string
    imgUrl?: string
    starCount?: number
    isPublic?: boolean
}

const RecipeCard = ({
    title,
    owner,
    imgUrl,
    starCount,
    isPublic
}: RecipeCardProps) => {
    return (
        <article>
            {imgUrl ? <img src={imgUrl} /> : null}
            <div className="title-rating-container">
                <h1>{title}</h1>
                {starCount ? <span>{starCount}</span> : null}
            </div>
            <div className="owner-container">
                {owner ? <p>@{owner}</p> : null}
            </div>
            <div className="is-public-container">
                {isPublic !== undefined ? (
                    isPublic ? (
                        <p>public</p>
                    ) : (
                        <p>not public</p>
                    )
                ) : null}
            </div>
        </article>
    )
}

export default RecipeCard
