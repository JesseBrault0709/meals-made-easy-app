import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import getRecipe from '../../api/getRecipe'
import Recipe from '../../pages/recipe/Recipe'

export const Route = createFileRoute('/recipes/$username/$slug')({
    loader: ({ context, params }) =>
        context.queryClient.ensureQueryData({
            queryKey: ['recipe', params.username, params.slug],
            queryFn: () =>
                getRecipe(context.auth.token, params.username, params.slug)
        }),
    component: () => {
        const recipe = useLoaderData({
            from: '/recipes/$username/$slug'
        })
        return <Recipe {...{ recipe }} />
    }
})
