import ImageView, { RawImageView } from './ImageView'
import UserInfoView from './UserInfoView'

export interface RawRecipeInfoView {
    id: number
    updated: string
    title: string
    ownerId: number
    owner: UserInfoView
    isPublic: boolean
    starCount: number
    mainImage: RawImageView
    slug: string
}

interface RecipeInfoView {
    id: number
    updated: Date
    title: string
    owner: UserInfoView
    isPublic: boolean
    starCount: number
    mainImage: ImageView
    slug: string
}

export default RecipeInfoView
