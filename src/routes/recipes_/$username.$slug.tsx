import {
    createFileRoute,
    useLoaderData,
    useParams
} from '@tanstack/react-router'
import getRecipe from '../../api/getRecipe'
import Recipe from '../../pages/recipe/Recipe'

export const Route = createFileRoute('/recipes/$username/$slug')({
    loader: ({ abortController, context, params }) =>
        context.queryClient.ensureQueryData({
            queryKey: ['recipe', params.username, params.slug],
            queryFn: () =>
                getRecipe({
                    abortController,
                    token: context.auth.token,
                    username: params.username,
                    slug: params.slug
                })
        }),
    component() {
        const recipe = useLoaderData({
            from: '/recipes/$username/$slug'
        })
        return <Recipe {...{ recipe }} />
    },
    notFoundComponent() {
        const { username, slug } = useParams({
            from: '/recipes/$username/$slug'
        })
        return (
            <p>
                404: Could not find a Recipe for {username}/{slug}
            </p>
        )
    }
})
