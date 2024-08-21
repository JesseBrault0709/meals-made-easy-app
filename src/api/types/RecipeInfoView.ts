import ImageView, { RawImageView, toImageView } from './ImageView'
import UserInfoView from './UserInfoView'

export interface RawRecipeInfoView {
    id: number
    created: string
    modified: string | null
    title: string
    preparationTime: number
    cookingTime: number
    totalTime: number
    owner: UserInfoView
    isPublic: boolean
    starCount: number
    mainImage: RawImageView | null
    slug: string
}

interface RecipeInfoView {
    id: number
    created: Date
    modified: Date | null
    title: string
    preparationTime: number
    cookingTime: number
    totalTime: number
    owner: UserInfoView
    isPublic: boolean
    starCount: number
    mainImage: ImageView | null
    slug: string
}

export const toRecipeInfoView = ({
    id,
    created: rawCreated,
    modified: rawModified,
    title,
    preparationTime,
    cookingTime,
    totalTime,
    owner,
    isPublic,
    starCount,
    mainImage: rawMainImage,
    slug
}: RawRecipeInfoView): RecipeInfoView => ({
    id,
    created: new Date(rawCreated),
    modified: rawModified !== null ? new Date(rawModified) : null,
    title,
    preparationTime,
    cookingTime,
    totalTime,
    owner,
    isPublic,
    starCount,
    mainImage: rawMainImage !== null ? toImageView(rawMainImage) : null,
    slug
})

export default RecipeInfoView
