import { createFileRoute, useParams } from '@tanstack/react-router'
import EditRecipe from '../../../pages/edit-recipe/EditRecipe'

export const Route = createFileRoute('/recipes/$username/$slug/edit')({
    component: () => {
        const { username, slug } = useParams({ from: '/recipes/$username/$slug/edit' })
        return <EditRecipe {...{ username, slug }} />
    }
})
