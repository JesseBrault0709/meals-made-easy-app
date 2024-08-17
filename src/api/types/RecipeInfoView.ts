import ImageView, { RawImageView } from './ImageView'
import UserInfoView from './UserInfoView'

export interface RawRecipeInfoView {
    id: number
    updated: string
    title: string
    preparationTime: number
    cookingTime: number
    totalTime: number
    ownerId: number
    owner: UserInfoView
    isPublic: boolean
    starCount: number
    mainImage: RawImageView | null
    slug: string
}

interface RecipeInfoView {
    id: number
    updated: Date
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

export default RecipeInfoView
