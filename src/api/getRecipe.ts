import { notFound } from '@tanstack/react-router'
import { ApiError } from './ApiError'
import FullRecipeView, { RawFullRecipeView } from './types/FullRecipeView'
import { toImageView } from './types/ImageView'

export interface GetRecipeDeps {
    token: string | null
    username: string
    slug: string
    abortController: AbortController
}

const getRecipe = async (
    token: string | null,
    ownerUsername: string,
    slug: string
): Promise<FullRecipeView> => {
    const headers = new Headers()
    if (token !== null) {
        headers.set('Authorization', `Bearer ${token}`)
    }
    const response = await fetch(
        import.meta.env.VITE_MME_API_URL + `/recipes/${ownerUsername}/${slug}`,
        {
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
            mainImage: rawMainImage
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
            mainImage: toImageView(rawMainImage)
        }
    } else if (response.status === 404) {
        throw notFound()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipe