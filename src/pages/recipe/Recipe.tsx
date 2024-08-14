import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QueryObserverSuccessResult, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '../../api/ApiError'
import getImage from '../../api/getImage'
import getRecipe from '../../api/getRecipe'
import FullRecipeView from '../../api/types/FullRecipeView'
import { useAuth } from '../../auth'
import RecipeVisibilityIcon from '../../components/recipe-visibility-icon/RecipeVisibilityIcon'
import UserIconAndName from '../../components/user-icon-and-name/UserIconAndName'
import classes from './recipe.module.css'

export interface RecipeProps {
    username: string
    slug: string
}

const Recipe = ({ username, slug }: RecipeProps) => {
    const authContext = useAuth()
    const queryClient = useQueryClient()

    const recipeQuery = useQuery(
        {
            queryKey: ['recipe', username, slug],
            queryFn: ({ signal: abortSignal }) =>
                getRecipe({
                    abortSignal,
                    authContext,
                    username,
                    slug
                })
        },
        queryClient
    )

    const mainImageQuery = useQuery(
        {
            enabled: recipeQuery.isSuccess,
            queryKey: ['images', recipeQuery.data?.mainImage.owner.username, recipeQuery.data?.mainImage.filename],
            queryFn: ({ signal }) =>
                getImage({
                    accessToken: authContext.token,
                    signal,
                    url: recipeQuery.data!.mainImage.url
                })
        },
        queryClient
    )

    if (recipeQuery.isLoading || mainImageQuery.isLoading) {
        return 'Loading...'
    } else if (recipeQuery.isError) {
        const { error } = recipeQuery
        if (error instanceof ApiError) {
            if (error.status === 404) {
                return 'No such recipe.'
            } else {
                return `ApiError: ${error.status} ${error.message}`
            }
        } else {
            return `Error: ${error.name} ${error.message}`
        }
    } else if (mainImageQuery.isError) {
        const { error } = mainImageQuery
        return `Error: ${error.name} ${error.message}`
    }

    const { data: recipe } = recipeQuery as QueryObserverSuccessResult<FullRecipeView>
    const { data: mainImageUrl } = mainImageQuery as QueryObserverSuccessResult<string>

    return (
        <div className={classes.fullRecipeContainer}>
            <article className={classes.fullRecipe}>
                <div className={classes.info}>
                    <div className={classes.infoRow}>
                        <h1 className={classes.recipeTitle}>{recipe.title}</h1>
                        <button className={classes.starButton}>
                            <FontAwesomeIcon icon="star" className={classes.star} size="sm" />
                            <span></span>
                            {recipe.starCount}
                        </button>
                    </div>
                    <div className={classes.infoRow}>
                        <UserIconAndName username={recipe.owner.username} />
                        <RecipeVisibilityIcon isPublic={recipe.isPublic} />
                    </div>
                </div>
                <img src={mainImageUrl} className={classes.mainImage} />
                <div dangerouslySetInnerHTML={{ __html: recipe.text }} />
            </article>
        </div>
    )
}

export default Recipe
