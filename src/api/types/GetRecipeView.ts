import FullRecipeView, {
    FullRecipeViewWithRawText,
    RawFullRecipeView,
    RawFullRecipeViewWithRawText,
    toFullRecipeView,
    toFullRecipeViewWithRawText
} from './FullRecipeView'

export interface RawGetRecipeView {
    recipe: RawFullRecipeView
    isStarred: boolean | null
    isOwner: boolean | null
}

export interface RawGetRecipeViewWithRawText extends RawGetRecipeView {
    recipe: RawFullRecipeViewWithRawText
}

interface GetRecipeView {
    recipe: FullRecipeView
    isStarred: boolean | null
    isOwner: boolean | null
}

export interface GetRecipeViewWithRawText extends GetRecipeView {
    recipe: FullRecipeViewWithRawText
}

export const toGetRecipeView = ({ recipe, isStarred, isOwner }: RawGetRecipeView): GetRecipeView => ({
    recipe: toFullRecipeView(recipe),
    isStarred,
    isOwner
})

export const toGetRecipeViewWithRawText = ({
    recipe,
    isStarred,
    isOwner
}: RawGetRecipeViewWithRawText): GetRecipeViewWithRawText => ({
    recipe: toFullRecipeViewWithRawText(recipe),
    isStarred,
    isOwner
})

export default GetRecipeView
