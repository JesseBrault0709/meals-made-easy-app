import { useQuery, useQueryClient } from '@tanstack/react-query'
import getRecipeInfos from '../../api/getRecipeInfos'
import { useState } from 'react'
import { useAuth } from '../../auth'
import { ApiError } from '../../api/ApiError'
import RecipeCard from '../../components/recipe-card/RecipeCard'
import classes from './recipes.module.css'

const Recipes = () => {
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const { token } = useAuth()

    const queryClient = useQueryClient()
    const { data, isPending, error } = useQuery(
        {
            queryKey: ['recipeInfos'],
            queryFn: ({ signal }) =>
                getRecipeInfos({
                    abortSignal: signal,
                    pageNumber,
                    pageSize,
                    token
                })
        },
        queryClient
    )

    if (isPending) {
        return <p>Loading...</p>
    } else if (error) {
        if (error instanceof ApiError) {
            return (
                <p>
                    ApiError: {error.status} {error.message}
                </p>
            )
        } else {
            return <p>Error: {error.message}</p>
        }
    } else {
        return (
            <>
                <h1>Recipes</h1>
                <section className={classes.recipeList}>
                    {data.content.map(view => (
                        <RecipeCard
                            key={view.id}
                            title={view.title}
                            ownerUsername={view.ownerUsername}
                            slug={view.slug}
                            mainImageUrl={view.mainImage.url}
                            mainImageAlt={
                                view.mainImage.alt
                                    ? view.mainImage.alt
                                    : undefined
                            }
                            starCount={view.starCount}
                            isPublic={view.isPublic}
                        />
                    ))}
                </section>
            </>
        )
    }
}

export default Recipes
