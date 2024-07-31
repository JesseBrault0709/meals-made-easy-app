import ImageView, { RawImageView } from './ImageView'

export interface RawRecipeInfoView {
    id: number
    updated: string
    title: string
    ownerId: number
    ownerUsername: string
    isPublic: boolean
    starCount: number
    mainImage: RawImageView
    slug: string
}

interface RecipeInfoView {
    id: number
    updated: Date
    title: string
    ownerId: number
    ownerUsername: string
    isPublic: boolean
    starCount: number
    mainImage: ImageView
    slug: string
}

export default RecipeInfoView
