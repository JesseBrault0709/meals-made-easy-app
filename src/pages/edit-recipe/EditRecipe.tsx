import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { PropsWithChildren, useEffect, useState } from 'react'
import { ApiError } from '../../api/ApiError'
import getRecipe from '../../api/getRecipe'
import { useAuth } from '../../auth'
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
    const auth = useAuth()
    const navigate = useNavigate()

    if (auth.token === null) {
        navigate({ to: '/login', search: { reason: 'NOT_LOGGED_IN', redirect: `/recipes/${username}/${slug}/edit` } })
    }

    const queryClient = useQueryClient()

    const recipeQuery = useQuery(
        {
            queryKey: ['recipes', username, slug],
            queryFn: ({ signal }) =>
                getRecipe({
                    authContext: auth,
                    username,
                    slug,
                    abortSignal: signal
                })
        },
        queryClient
    )

    const [isOwner, setIsOwner] = useState(false)
    const [title, setTitle] = useState('')
    const [mSlug, setMSlug] = useState('')
    const [preparationTime, setPreparationTime] = useState<number | null>(null)
    const [cookingTime, setCookingTime] = useState<number | null>(null)
    const [totalTime, setTotalTime] = useState<number | null>(null)
    const [recipeText, setRecipeText] = useState('')

    useEffect(() => {
        if (recipeQuery.isSuccess) {
            const { isOwner, recipe } = recipeQuery.data
            if (!isOwner) {
                setIsOwner(false)
            } else {
                setIsOwner(true)
                setTitle(recipe.title)
                setMSlug(recipe.slug)
                setPreparationTime(recipe.preparationTime)
                setCookingTime(recipe.cookingTime)
                setTotalTime(recipe.totalTime)
                setRecipeText(recipe.text)
            }
        }
    }, [recipeQuery.isSuccess, recipeQuery.data])

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
                    <form className={classes.editForm}>
                        <Control id="title" displayName="Title">
                            <TextInput id="title" value={title} setValue={setTitle} />
                        </Control>

                        <Control id="slug" displayName="Slug">
                            <TextInput id="slug" value={mSlug} setValue={setMSlug} />
                        </Control>

                        <Control id="preparation-time" displayName="Preparation Time (in minutes)">
                            <TimeInput id="preparation-time" value={preparationTime} setValue={setPreparationTime} />
                        </Control>

                        <Control id="cooking-time" displayName="Cooking Time (in minutes)">
                            <TimeInput id="cooking-time" value={cookingTime} setValue={setCookingTime} />
                        </Control>

                        <Control id="total-time" displayName="Total Time (in minutes)">
                            <TimeInput id="total-time" value={totalTime} setValue={setTotalTime} />
                        </Control>

                        <Control id="recipe-text" displayName="Recipe Text">
                            <textarea value={recipeText} onChange={e => setRecipeText(e.target.value)} />
                        </Control>
                    </form>
                </article>
            </div>
        )
    }
}

export default EditRecipe
