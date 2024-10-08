import ImageView, { RawImageView, toImageView } from './ImageView'
import UserInfoView from './UserInfoView'

export interface RawFullRecipeView {
    id: number
    created: string
    modified: string | null
    slug: string
    title: string
    preparationTime: number | null
    cookingTime: number | null
    totalTime: number | null
    text: string
    owner: UserInfoView
    starCount: number
    viewerCount: number
    mainImage: RawImageView | null
    isPublic: boolean
}

export interface RawFullRecipeViewWithRawText extends RawFullRecipeView {
    rawText: string
}

interface FullRecipeView {
    id: number
    created: Date
    modified: Date | null
    slug: string
    title: string
    preparationTime: number | null
    cookingTime: number | null
    totalTime: number | null
    text: string
    owner: UserInfoView
    starCount: number
    viewerCount: number
    mainImage: ImageView | null
    isPublic: boolean
}

export interface FullRecipeViewWithRawText extends FullRecipeView {
    rawText: string
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
    viewerCount,
    mainImage: rawMainImage !== null ? toImageView(rawMainImage) : null,
    isPublic
})

export const toFullRecipeViewWithRawText = (raw: RawFullRecipeViewWithRawText): FullRecipeViewWithRawText => ({
    rawText: raw.rawText,
    ...toFullRecipeView(raw)
})

export default FullRecipeView
