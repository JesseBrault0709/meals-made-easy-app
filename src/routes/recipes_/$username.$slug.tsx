import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import getRecipe from '../../api/getRecipe'
import { useAuth } from '../../auth'
import Recipe from '../../pages/recipe/Recipe'
import getImage from '../../api/getImage'

export const Route = createFileRoute('/recipes/$username/$slug')({
    component() {
        const { username, slug } = useParams({
            from: '/recipes/$username/$slug'
        })
        const authContext = useAuth()
        const queryClient = useQueryClient()
        const {
            isLoading,
            error,
            data: recipe
        } = useQuery(
            {
                queryKey: ['recipe', username, slug],
                queryFn({ signal: abortSignal }) {
                    return getRecipe({
                        abortSignal,
                        authContext,
                        username,
                        slug
                    })
                }
            },
            queryClient
        )

        const {
            isLoading: isImageLoading,
            error: imageError,
            data: imgUrl
        } = useQuery(
            {
                enabled: recipe !== undefined,
                queryKey: ['images', recipe?.mainImage.owner.username, recipe?.mainImage.filename],
                queryFn: ({ signal }) =>
                    getImage({
                        accessToken: authContext.token,
                        signal,
                        url: recipe!.mainImage.url
                    })
            },
            queryClient
        )

        if (isLoading || isImageLoading) {
            return 'Loading...'
        } else if (error !== null) {
            return `Error: ${error.name} ${error.message}`
        } else if (imageError !== null) {
            return `Image loading error: ${imageError} ${imageError.message}`
        } else if (recipe !== undefined && imgUrl !== undefined) {
            return <Recipe {...{ recipe, imgUrl }} />
        } else {
            return null
        }
    }
})
