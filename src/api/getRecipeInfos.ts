import AccessToken from '../types/AccessToken'
import { ApiError } from './ApiError'
import ExpiredTokenError from './ExpiredTokenError'
import { toImageView } from './types/ImageView'
import RecipeInfosView, { RawRecipeInfosView } from './types/RecipeInfosView'
import { addBearer } from './util'

export interface GetRecipeInfosDeps {
    abortSignal: AbortSignal
    accessToken: AccessToken | null
    pageNumber: number
    pageSize: number
}

const getRecipeInfos = async ({
    abortSignal,
    accessToken,
    pageNumber,
    pageSize
}: GetRecipeInfosDeps): Promise<RecipeInfosView> => {
    const headers = new Headers()
    if (accessToken !== null) {
        addBearer(headers, accessToken)
    }
    const response = await fetch(import.meta.env.VITE_MME_API_URL + `/recipes?page=${pageNumber}&size=${pageSize}`, {
        signal: abortSignal,
        headers,
        mode: 'cors'
    })
    if (response.ok) {
        const { pageNumber, pageSize, content } = (await response.json()) as RawRecipeInfosView
        return {
            pageNumber,
            pageSize,
            content: content.map(
                ({
                    id,
                    updated: rawUpdated,
                    title,
                    preparationTime,
                    cookingTime,
                    totalTime,
                    ownerId,
                    owner,
                    isPublic,
                    starCount,
                    mainImage: rawMainImage,
                    slug
                }) => ({
                    id,
                    updated: new Date(rawUpdated),
                    title,
                    preparationTime,
                    cookingTime,
                    totalTime,
                    ownerId,
                    owner,
                    isPublic,
                    starCount,
                    mainImage: rawMainImage !== null ? toImageView(rawMainImage) : null,
                    slug
                })
            )
        }
    } else if (response.status === 401) {
        throw new ExpiredTokenError()
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipeInfos
