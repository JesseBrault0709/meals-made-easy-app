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
                <div className={classes.info}>
                    <div className={classes.infoRow}>
                        <h1 className={classes.recipeTitle}>{recipe.title}</h1>
                        <StarCount count={recipe.starCount} />
                    </div>
                    <div className={classes.infoRow}>
                        <UserIconAndName username={recipe.owner.username} />
                        <RecipeVisibilityIcon isPublic={recipe.isPublic} />
                    </div>
                </div>
                <img src={imgUrl} className={classes.mainImage} />
                <div dangerouslySetInnerHTML={{ __html: recipe.text }} />
            </article>
        </div>
    )
}

export default Recipe
