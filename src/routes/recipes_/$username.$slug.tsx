import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import getRecipe from '../../api/getRecipe'
import { useAuth } from '../../auth'
import Recipe from '../../pages/recipe/Recipe'

export const Route = createFileRoute('/recipes/$username/$slug')({
    component() {
        const { username, slug } = useParams({
            from: '/recipes/$username/$slug'
        })
        const authContext = useAuth()
        const {
            isLoading,
            error,
            data: recipe
        } = useQuery({
            queryKey: ['recipe', username, slug],
            queryFn({ signal: abortSignal }) {
                return getRecipe({
                    abortSignal,
                    authContext,
                    username,
                    slug
                })
            }
        })
        if (isLoading) {
            return 'Loading...'
        } else if (error !== null) {
            return `Error: ${error.name}${error.message}`
        } else if (recipe !== undefined) {
            return <Recipe {...{ recipe }} />
        } else {
            return null
        }
    }
})
