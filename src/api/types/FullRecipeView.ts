import ImageView, { RawImageView } from './ImageView'

export interface RawFullRecipeView {
    id: number
    created: string
    modified: string | null
    slug: string
    title: string
    text: string
    ownerId: number
    ownerUsername: string
    starCount: number
    viewerCount: number
    mainImage: RawImageView
}

interface FullRecipeView {
    id: number
    created: Date
    modified: Date | null
    slug: string
    title: string
    text: string
    ownerId: number
    ownerUsername: string
    starCount: number
    viewerCount: number
    mainImage: ImageView
}

export default FullRecipeView
