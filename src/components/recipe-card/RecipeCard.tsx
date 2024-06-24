export interface RecipeCardProps {
    title: string
    owner?: string
    imgUrl?: string
    rating?: number
}

const RecipeCard = ({ title, owner, imgUrl, rating }: RecipeCardProps) => {
    return (
        <article>
            {imgUrl ? <img src={imgUrl} /> : null}
            <div className="title-rating-container">
                <h1>{title}</h1>
                {rating ? <span>{Math.round(rating)}/5</span> : null}
            </div>
            <div className="owner-container">
                {owner ? <p>@{owner}</p> : null}
            </div>
        </article>
    )
}

export default RecipeCard
