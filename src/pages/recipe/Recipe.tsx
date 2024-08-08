import FullRecipeView from '../../api/types/FullRecipeView'
import RecipeVisibilityIcon from '../../components/recipe-visibility-icon/RecipeVisibilityIcon'
import StarCount from '../../components/star-count/StarCount'
import UserIconAndName from '../../components/user-icon-and-name/UserIconAndName'
import classes from './recipe.module.css'

export interface RecipeProps {
    recipe: FullRecipeView
    imgUrl: string
}

const Recipe = ({ recipe, imgUrl }: RecipeProps) => {
    return (
        <div className={classes.fullRecipeContainer}>
            <article className={classes.fullRecipe}>
                <img src={imgUrl} className={classes.mainImage} />
                <div className={classes.infoRow}>
                    <h1>{recipe.title}</h1>
                    <StarCount count={recipe.starCount} />
                </div>
                <div className={classes.infoRow}>
                    <UserIconAndName username={recipe.ownerUsername} />
                    <RecipeVisibilityIcon isPublic={recipe.isPublic} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: recipe.text }} />
            </article>
        </div>
    )
}

export default Recipe
