import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    ChangeEventHandler,
    FormEventHandler,
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import { ApiError } from '../../api/ApiError'
import getRecipe from '../../api/getRecipe'
import { FullRecipeViewWithRawText } from '../../api/types/FullRecipeView'
import UpdateRecipeSpec, { MainImageUpdateSpec } from '../../api/types/UpdateRecipeSpec'
import updateRecipe from '../../api/updateRecipe'
import { useAuth } from '../../AuthProvider'
import { useRefresh } from '../../RefreshProvider'
import classes from './edit-recipe.module.css'

interface ControlProps {
    id: string
    displayName: string
}

const Control = ({ id, displayName, children }: PropsWithChildren<ControlProps>) => {
    return (
        <div className={classes.control}>
            <label htmlFor={id}>{displayName}</label>
            {children}
        </div>
    )
}

const getOnTimeChange =
    (setTime: (n: number | null) => void): ChangeEventHandler<HTMLInputElement> =>
    e => {
        if (e.target.value === '') {
            setTime(null)
        } else {
            const parsed = parseInt(e.target.value)
            if (!Number.isNaN(parsed)) {
                setTime(parsed)
            }
        }
    }

export interface EditRecipeProps {
    username: string
    slug: string
}

const EditRecipe = ({ username, slug }: EditRecipeProps) => {
    const { accessToken } = useAuth()
    const refresh = useRefresh()
    const queryClient = useQueryClient()

    const titleRef = useRef<HTMLInputElement | null>(null)
    const [preparationTime, setPreparationTime] = useState<number | null>(null)
    const [cookingTime, setCookingTime] = useState<number | null>(null)
    const [totalTime, setTotalTime] = useState<number | null>(null)
    const recipeTextRef = useRef<HTMLTextAreaElement | null>(null)
    const isPublicRef = useRef<HTMLInputElement | null>(null)
    const [mainImage, setMainImage] = useState<MainImageUpdateSpec | null>(null)

    const onPreparationTimeChange = useCallback(getOnTimeChange(setPreparationTime), [setPreparationTime])
    const onCookingTimeChange = useCallback(getOnTimeChange(setCookingTime), [setCookingTime])
    const onTotalTimeChange = useCallback(getOnTimeChange(setTotalTime), [setTotalTime])

    const setState = useCallback(
        (recipe: FullRecipeViewWithRawText) => {
            if (titleRef.current) {
                titleRef.current.value = recipe.title
            }
            setPreparationTime(recipe.preparationTime)
            setCookingTime(recipe.cookingTime)
            setTotalTime(recipe.totalTime)
            if (recipeTextRef.current) {
                recipeTextRef.current.value = recipe.rawText
            }
            if (isPublicRef.current) {
                isPublicRef.current.checked = recipe.isPublic
            }
            setMainImage(
                recipe.mainImage
                    ? {
                          username: recipe.mainImage.owner.username,
                          filename: recipe.mainImage?.filename
                      }
                    : null
            )
        },
        [setPreparationTime, setCookingTime, setTotalTime, setMainImage]
    )

    const recipeQuery = useQuery(
        {
            queryKey: ['recipes', username, slug],
            queryFn: ({ signal }) =>
                getRecipe({
                    accessToken,
                    includeRawText: true,
                    refresh,
                    slug,
                    signal,
                    username
                })
        },
        queryClient
    )

    useEffect(() => {
        if (recipeQuery.isSuccess) {
            setState(recipeQuery.data.recipe)
        }
    }, [recipeQuery.isSuccess, setState, recipeQuery.data?.recipe])

    const mutation = useMutation(
        {
            mutationFn: (variables: { spec: UpdateRecipeSpec }) => {
                if (accessToken !== null) {
                    return updateRecipe({
                        spec: variables.spec,
                        accessToken,
                        refresh,
                        username,
                        slug
                    })
                } else {
                    return Promise.reject('Must be logged in.')
                }
            },
            onSuccess: data => {
                setState(data.recipe)
                queryClient.setQueryData(['recipes', username, slug], data)
            }
        },
        queryClient
    )

    const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
        e => {
            e.preventDefault()
            mutation.mutate({
                spec: {
                    title: titleRef.current!.value,
                    preparationTime,
                    cookingTime,
                    totalTime,
                    rawText: recipeTextRef.current!.value,
                    isPublic: isPublicRef.current!.checked,
                    mainImage
                }
            })
            return false
        },
        [mutation]
    )

    if (recipeQuery.isPending) {
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
    } else if (recipeQuery.isSuccess && !recipeQuery.data.isOwner) {
        return 'You do not have permission to edit this recipe.'
    } else {
        return (
            <div className={classes.articleContainer}>
                <article>
                    <h1>Edit Recipe</h1>
                    <form className={classes.editForm} onSubmit={onSubmit}>
                        <Control id="title" displayName="Title">
                            <input id="title" type="text" ref={titleRef} />
                        </Control>

                        <Control id="preparation-time" displayName="Preparation Time (in minutes)">
                            <input
                                id="preparation-time"
                                type="text"
                                value={preparationTime?.toString() ?? ''}
                                onChange={onPreparationTimeChange}
                            />
                        </Control>

                        <Control id="cooking-time" displayName="Cooking Time (in minutes)">
                            <input
                                id="cooking-time"
                                type="text"
                                value={cookingTime?.toString() ?? ''}
                                onChange={onCookingTimeChange}
                            />
                        </Control>

                        <Control id="total-time" displayName="Total Time (in minutes)">
                            <input
                                id="total-time"
                                type="text"
                                value={totalTime?.toString() ?? ''}
                                onChange={onTotalTimeChange}
                            />
                        </Control>

                        <Control id="recipe-text" displayName="Recipe Text">
                            <textarea id="recipe-text" ref={recipeTextRef} />
                        </Control>

                        <Control id="is-public" displayName="Is Public?">
                            <input id="is-public" type="checkbox" ref={isPublicRef} />
                        </Control>

                        <div className={classes.submitContainer}>
                            <input type="submit" />
                            {mutation.isPending
                                ? 'Saving...'
                                : mutation.isSuccess
                                  ? 'Saved!'
                                  : mutation.isError
                                    ? `Error! ${mutation.error}`
                                    : null}
                        </div>
                    </form>
                </article>
            </div>
        )
    }
}

export default EditRecipe
