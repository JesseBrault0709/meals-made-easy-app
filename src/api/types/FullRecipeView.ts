import ImageView, { RawImageView, toImageView } from './ImageView'
import UserInfoView from './UserInfoView'

export interface RawFullRecipeView {
    id: number
    created: string
    modified: string | null
    slug: string
    title: string
    preparationTime: number
    cookingTime: number
    totalTime: number
    text: string
    owner: UserInfoView
    starCount: number
    isStarred: boolean | null
    viewerCount: number
    mainImage: RawImageView
    isPublic: boolean
}

interface FullRecipeView {
    id: number
    created: Date
    modified: Date | null
    slug: string
    title: string
    preparationTime: number
    cookingTime: number
    totalTime: number
    text: string
    owner: UserInfoView
    starCount: number
    isStarred: boolean | null
    viewerCount: number
    mainImage: ImageView
    isPublic: boolean
}

export const toFullRecipeView = ({
    id,
    created: rawCreated,
    modified: rawModified,
    slug,
    title,
    preparationTime,
    cookingTime,
    totalTime,
    text,
    owner,
    starCount,
    isStarred,
    viewerCount,
    mainImage: rawMainImage,
    isPublic
}: RawFullRecipeView): FullRecipeView => ({
    id,
    created: new Date(rawCreated),
    modified: rawModified ? new Date(rawModified) : null,
    slug,
    title,
    preparationTime,
    cookingTime,
    totalTime,
    text,
    owner,
    starCount,
    isStarred,
    viewerCount,
    mainImage: toImageView(rawMainImage),
    isPublic
})

export default FullRecipeView
