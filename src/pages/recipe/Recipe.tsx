import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QueryObserverSuccessResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import addStar from '../../api/addStar'
import { ApiError } from '../../api/ApiError'
import getImage from '../../api/getImage'
import getRecipe from '../../api/getRecipe'
import removeStar from '../../api/removeStar'
import GetRecipeView from '../../api/types/GetRecipeView'
import { useAuth } from '../../AuthProvider'
import RecipeVisibilityIcon from '../../components/recipe-visibility-icon/RecipeVisibilityIcon'
import UserIconAndName from '../../components/user-icon-and-name/UserIconAndName'
import { useRefresh } from '../../RefreshProvider'
import classes from './recipe.module.css'

interface EditButtonProps {
    username: string
    slug: string
}

const EditButton = ({ username, slug }: EditButtonProps) => {
    const navigate = useNavigate()
    return (
        <button
            className={classes.editButton}
            onClick={() => navigate({ to: '/recipes/$username/$slug/edit', params: { username, slug } })}
        >
            <FontAwesomeIcon icon="pencil" className={classes.editIcon} size="sm" />
            <span className={classes.buttonText}>Edit</span>
        </button>
    )
}

interface RecipeStarInfoProps {
    starCount: number
}

const RecipeStarInfo = ({ starCount }: RecipeStarInfoProps) => {
    return (
        <div className={classes.starContainer}>
            <FontAwesomeIcon icon="star" className={classes.star} size="sm" />
            <span className={classes.buttonText}>{starCount}</span>
        </div>
    )
}

interface RecipeStarButtonProps {
    username: string
    slug: string
    isStarred: boolean
    starCount: number
}

const RecipeStarButton = ({ username, slug, isStarred, starCount }: RecipeStarButtonProps) => {
    const { accessToken } = useAuth()
    const queryClient = useQueryClient()
    const refresh = useRefresh()

    const addStarMutation = useMutation({
        mutationFn: () => {
            if (accessToken !== null) {
                return addStar({
                    accessToken,
                    refresh,
                    username,
                    slug
                })
            } else {
                return Promise.resolve()
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes', username, slug] })
        }
    })

    const removeStarMutation = useMutation({
        mutationFn: () => {
            if (accessToken !== null) {
                return removeStar({
                    accessToken,
                    refresh,
                    slug,
                    username
                })
            } else {
                return Promise.resolve()
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes', username, slug] })
        }
    })

    const onClick = () => {
        if (isStarred) {
            removeStarMutation.mutate()
        } else {
            addStarMutation.mutate()
        }
    }

    return (
        <button className={classes.starContainer} onClick={onClick}>
            <FontAwesomeIcon icon="star" className={classes.star} size="sm" />
            <span className={classes.buttonText}>{isStarred ? 'Starred' : 'Star'}</span>
            <span className={classes.starCount}>{starCount}</span>
        </button>
    )
}

export interface RecipeProps {
    username: string
    slug: string
}

const Recipe = ({ username, slug }: RecipeProps) => {
    const { accessToken } = useAuth()
    const queryClient = useQueryClient()
    const refresh = useRefresh()

    const recipeQuery = useQuery(
        {
            queryKey: ['recipes', username, slug],
            queryFn: ({ signal }) =>
                getRecipe({
                    accessToken,
                    refresh,
                    signal,
                    slug,
                    username
                })
        },
        queryClient
    )

    const mainImageQuery = useQuery(
        {
            enabled: recipeQuery.isSuccess && recipeQuery.data!.recipe.mainImage !== null,
            queryKey: [
                'images',
                recipeQuery.data?.recipe.mainImage?.owner.username,
                recipeQuery.data?.recipe.mainImage?.filename
            ],
            queryFn: ({ signal }) =>
                getImage({
                    accessToken,
                    signal,
                    refresh,
                    url: recipeQuery.data!.recipe.mainImage!.url
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

    const { data: getRecipeView } = recipeQuery as QueryObserverSuccessResult<GetRecipeView>
    const { data: mainImageUrl } = mainImageQuery as QueryObserverSuccessResult<string>
    const { recipe, isStarred, isOwner } = getRecipeView

    return (
        <div className={classes.fullRecipeContainer}>
            <article className={classes.fullRecipe}>
                <div className={classes.info}>
                    <div className={classes.infoRow}>
                        <h1 className={classes.recipeTitle}>{recipe.title}</h1>
                        <div className={classes.infoButtons}>
                            {isStarred !== null ? (
                                <RecipeStarButton starCount={recipe.starCount} {...{ isStarred, username, slug }} />
                            ) : (
                                <RecipeStarInfo starCount={recipe.starCount} />
                            )}
                            {isOwner ? <EditButton {...{ username, slug }} /> : null}
                        </div>
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
