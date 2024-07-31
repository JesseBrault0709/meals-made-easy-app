import {
    createFileRoute,
    ErrorComponent,
    useLoaderData,
    useParams
} from '@tanstack/react-router'
import { ApiError } from '../../api/ApiError'
import getRecipe from '../../api/getRecipe'
import Recipe from '../../pages/recipe/Recipe'

export const Route = createFileRoute('/recipes/$username/$slug')({
    loader: ({ abortController, context, params }) =>
        context.queryClient.ensureQueryData({
            queryKey: ['recipe', params.username, params.slug],
            queryFn: () =>
                getRecipe({
                    abortSignal: abortController.signal,
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
    errorComponent({ error }) {
        if (error instanceof ApiError) {
            return (
                <p>
                    {error.status}: {error.message}
                </p>
            )
        }
        return <ErrorComponent error={error} />
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
