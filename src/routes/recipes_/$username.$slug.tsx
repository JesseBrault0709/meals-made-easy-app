import { createFileRoute, useParams } from '@tanstack/react-router'
import Recipe from '../../pages/recipe/Recipe'

export const Route = createFileRoute('/recipes/$username/$slug')({
    component() {
        const { username, slug } = useParams({
            from: '/recipes/$username/$slug'
        })
        return <Recipe {...{ username, slug }} />
    }
})
