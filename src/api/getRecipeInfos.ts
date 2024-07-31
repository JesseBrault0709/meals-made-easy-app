import { ApiError } from './ApiError'
import RecipeInfosView, { RawRecipeInfosView } from './types/RecipeInfosView'

const getRecipeInfos = async (
    token: string | null,
    pageNumber: number,
    pageSize: number
): Promise<RecipeInfosView> => {
    const headers = new Headers()
    if (token !== null) {
        headers.set('Authorization', `Bearer ${token}`)
    }
    const response = await fetch(
        import.meta.env.VITE_MME_API_URL +
            `/recipes?page=${pageNumber}&size=${pageSize}`,
        {
            headers,
            mode: 'cors'
        }
    )
    if (response.ok) {
        const { pageNumber, pageSize, content } =
            (await response.json()) as RawRecipeInfosView
        return {
            pageNumber,
            pageSize,
            content: content.map(
                ({
                    id,
                    updated: rawUpdated,
                    title,
                    ownerId,
                    ownerUsername,
                    isPublic,
                    starCount,
                    mainImage: rawMainImage,
                    slug
                }) => ({
                    id,
                    updated: new Date(rawUpdated),
                    title,
                    ownerId,
                    ownerUsername,
                    isPublic,
                    starCount,
                    mainImage: {
                        url: rawMainImage.url,
                        created: new Date(rawMainImage.created),
                        modified: rawMainImage.modified
                            ? new Date(rawMainImage.modified)
                            : null,
                        filename: rawMainImage.fileName,
                        mimeType: rawMainImage.mimeType,
                        alt: rawMainImage.alt,
                        caption: rawMainImage.caption,
                        owner: rawMainImage.owner,
                        isPublic: rawMainImage.isPublic
                    },
                    slug
                })
            )
        }
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipeInfos
