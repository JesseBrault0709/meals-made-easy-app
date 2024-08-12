import ImageView, { RawImageView, toImageView } from './ImageView'
import UserInfoView from './UserInfoView'

export interface RawFullRecipeView {
    id: number
    created: string
    modified: string | null
    slug: string
    title: string
    text: string
    owner: UserInfoView
    starCount: number
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
    text: string
    owner: UserInfoView
    starCount: number
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
    text,
    owner,
    starCount,
    viewerCount,
    mainImage: rawMainImage,
    isPublic
}: RawFullRecipeView) => ({
    id,
    created: new Date(rawCreated),
    modified: rawModified ? new Date(rawModified) : null,
    slug,
    title,
    text,
    owner,
    starCount,
    viewerCount,
    mainImage: toImageView(rawMainImage),
    isPublic
})

export default FullRecipeView
