import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './recipe-visibility-icon.module.css'

export interface RecipeVisibilityIconProps {
    isPublic: boolean
}

const RecipeVisibilityIcon = ({ isPublic }: RecipeVisibilityIconProps) =>
    isPublic ? (
        <FontAwesomeIcon icon="globe" className={classes.recipeVisibilityIcon} size="sm" />
    ) : (
        <FontAwesomeIcon icon="lock" className={classes.recipeVisibilityIcon} size="sm" />
    )

export default RecipeVisibilityIcon
