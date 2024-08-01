import { notFound } from '@tanstack/react-router'
import { ApiError } from './ApiError'
import FullRecipeView, { RawFullRecipeView } from './types/FullRecipeView'
import { toImageView } from './types/ImageView'

export interface GetRecipeDeps {
    token: string | null
    username: string
    slug: string
    abortSignal: AbortSignal
}

const getRecipe = async ({
    token,
    username,
    slug,
    abortSignal
}: GetRecipeDeps): Promise<FullRecipeView> => {
    const headers = new Headers()
    if (token !== null) {
        headers.set('Authorization', `Bearer ${token}`)
    }
    const response = await fetch(
        import.meta.env.VITE_MME_API_URL + `/recipes/${username}/${slug}`,
        {
            signal: abortSignal,
            headers,
            mode: 'cors'
        }
    )
    if (response.ok) {
        const {
            id,
            created: rawCreated,
            modified: rawModified,
            slug,
            title,
            text,
            ownerId,
            ownerUsername,
            starCount,
            viewerCount,
            mainImage: rawMainImage,
            isPublic
        } = (await response.json()) as RawFullRecipeView
        return {
            id,
            created: new Date(rawCreated),
            modified: rawModified ? new Date(rawModified) : null,
            slug,
            title,
            text,
            ownerId,
            ownerUsername,
            starCount,
            viewerCount,
            mainImage: toImageView(rawMainImage),
            isPublic
        }
    } else if (response.status === 404) {
        throw notFound()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipe
