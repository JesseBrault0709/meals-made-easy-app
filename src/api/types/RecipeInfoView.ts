import ImageView from './ImageView'

export interface RecipeInfoView {
    id: number
    updated: Date
    title: string
    ownerId: number
    ownerUsername: string
    isPublic: boolean
    starCount: number
    mainImage: ImageView
}
