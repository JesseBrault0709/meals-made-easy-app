import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ChangeEventHandler, FormEventHandler, PropsWithChildren, useEffect, useState } from 'react'
import { ApiError } from '../../api/ApiError'
import getRecipe from '../../api/getRecipe'
import UpdateRecipeSpec, { fromFullRecipeView } from '../../api/types/UpdateRecipeSpec'
import updateRecipe from '../../api/updateRecipe'
import { useAuth } from '../../AuthProvider'
import classes from './edit-recipe.module.css'
import { useRefresh } from '../../RefreshProvider'

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

type TextInputProps = {
    id: string
} & (NullableTextInputProps | NonNullableTextInputProps)

interface NullableTextInputProps {
    nullable: true
    value: string | null
    setValue(newValue: string | null): void
}

interface NonNullableTextInputProps {
    nullable?: false
    value: string
    setValue(newValue: string): void
}

const TextInput = ({ nullable, id, value, setValue }: TextInputProps) => {
    return (
        <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={e => {
                if (nullable) {
                    setValue(e.target.value === '' ? null : e.target.value)
                } else {
                    setValue(e.target.value)
                }
            }}
        />
    )
}

interface TimeInputProps {
    id: string
    value: number | null
    setValue(newValue: number | null): void
}

const TimeInput = ({ id, value, setValue }: TimeInputProps) => {
    return (
        <input
            id={id}
            value={value ?? ''}
            onChange={e => {
                if (e.target.value === '') {
                    setValue(null)
                } else {
                    const parsed = parseInt(e.target.value)
                    if (!Number.isNaN(parsed)) {
                        setValue(parsed)
                    }
                }
            }}
        />
    )
}

export interface EditRecipeProps {
    username: string
    slug: string
}

const EditRecipe = ({ username, slug }: EditRecipeProps) => {
    const { accessToken } = useAuth()
    const navigate = useNavigate()
    const refresh = useRefresh()

    // useEffect(() => {
    //     if (auth.token === null) {
    //         navigate({
    //             to: '/login',
    //             search: { reason: 'NOT_LOGGED_IN', redirect: `/recipes/${username}/${slug}/edit` }
    //         })
    //     }
    // }, [auth.token, navigate, username, slug])

    const queryClient = useQueryClient()

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

    const [isOwner, setIsOwner] = useState(false)

    const [spec, setSpec] = useState<UpdateRecipeSpec>({
        title: '',
        preparationTime: null,
        cookingTime: null,
        totalTime: null,
        rawText: '',
        mainImage: null,
        isPublic: false
    })

    useEffect(() => {
        if (recipeQuery.isSuccess) {
            const { isOwner, recipe } = recipeQuery.data
            setIsOwner(isOwner ?? false)
            if (isOwner) {
                setSpec(fromFullRecipeView(recipe))
            }
        }
    }, [recipeQuery.isSuccess, recipeQuery.data])

    const mutation = useMutation(
        {
            mutationFn: () => {
                if (accessToken !== null) {
                    return updateRecipe({
                        spec,
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
                setIsOwner(data.isOwner ?? false)
                setSpec(fromFullRecipeView(data.recipe))
                queryClient.invalidateQueries({
                    queryKey: ['recipes', username, slug]
                })
            }
        },
        queryClient
    )

    const onSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()
        mutation.mutate()
        return false
    }

    const getSetSpecText =
        (prop: keyof UpdateRecipeSpec) =>
        (value: string): void => {
            const next = { ...spec }
            ;(next as any)[prop] = value
            setSpec(next)
        }

    const getSetTimeSpec =
        (prop: keyof UpdateRecipeSpec) =>
        (value: number | null): void => {
            const next = { ...spec }
            ;(next as any)[prop] = value
            setSpec(next)
        }

    const getSetSpecTextAsHandler =
        (prop: keyof UpdateRecipeSpec): ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> =>
        (event): void => {
            const next = { ...spec }
            ;(next as any)[prop] = event.target.value
            setSpec(next)
        }

    if (recipeQuery.isLoading) {
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
    } else if (!isOwner) {
        return 'You do not have permission to edit this recipe.'
    } else {
        return (
            <div className={classes.articleContainer}>
                <article>
                    <h1>Edit Recipe</h1>
                    <form className={classes.editForm} onSubmit={onSubmit}>
                        <Control id="title" displayName="Title">
                            <TextInput id="title" value={spec.title} setValue={getSetSpecText('title')} />
                        </Control>

                        <Control id="preparation-time" displayName="Preparation Time (in minutes)">
                            <TimeInput
                                id="preparation-time"
                                value={spec.preparationTime}
                                setValue={getSetTimeSpec('preparationTime')}
                            />
                        </Control>

                        <Control id="cooking-time" displayName="Cooking Time (in minutes)">
                            <TimeInput
                                id="cooking-time"
                                value={spec.cookingTime}
                                setValue={getSetTimeSpec('cookingTime')}
                            />
                        </Control>

                        <Control id="total-time" displayName="Total Time (in minutes)">
                            <TimeInput id="total-time" value={spec.totalTime} setValue={getSetTimeSpec('totalTime')} />
                        </Control>

                        <Control id="recipe-text" displayName="Recipe Text">
                            <textarea value={spec.rawText} onChange={getSetSpecTextAsHandler('rawText')} />
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
