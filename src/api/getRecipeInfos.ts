import { ApiError } from './ApiError'

export interface RecipeInfoView {
    id: number
    updated: Date
    title: string
    ownerId: number
    ownerUsername: string
    isPublic: boolean
    starCount: number
}

export interface RecipeInfosView {
    pageNumber: number
    pageSize: number
    content: RecipeInfoView[]
}

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
        return (await response.json()) as RecipeInfosView
    } else {
        throw new ApiError(response.status, response.statusText)
    }
}

export default getRecipeInfos
