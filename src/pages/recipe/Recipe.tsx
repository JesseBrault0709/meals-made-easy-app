import FullRecipeView from '../../api/types/FullRecipeView'

export interface RecipeProps {
    recipe: FullRecipeView
}

const Recipe = ({ recipe }: RecipeProps) => {
    return (
        <article>
            <h1>{recipe.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: recipe.text }} />
        </article>
    )
}

export default Recipe
