import { useQuery } from '@tanstack/react-query'
import getRecipeInfos from '../../api/getRecipeInfos'
import { useState } from 'react'
import { useAuth } from '../../auth'
import { ApiError } from '../../api/ApiError'
import RecipeCard from '../../components/recipe-card/RecipeCard'

const Recipes = () => {
    const [pageNumber, setPageNumber] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const { token } = useAuth()

    const { data, isPending, error } = useQuery({
        queryKey: ['recipeInfos'],
        queryFn: () => getRecipeInfos(token, pageNumber, pageSize)
    })

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
        return data.content.map(view => (
            <RecipeCard
                key={view.id}
                title={view.title}
                ownerUsername={view.ownerUsername}
                mainImageUrl={view.mainImage.url}
                starCount={view.starCount}
                isPublic={view.isPublic}
            />
        ))
    }
}

export default Recipes
