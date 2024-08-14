import FullRecipeView, { RawFullRecipeView, toFullRecipeView } from './FullRecipeView'

export interface RawGetRecipeView {
    recipe: RawFullRecipeView
    isStarred: boolean | null
    isOwner: boolean | null
}

interface GetRecipeView {
    recipe: FullRecipeView
    isStarred: boolean | null
    isOwner: boolean | null
}

export const toGetRecipeView = ({ recipe, isStarred, isOwner }: RawGetRecipeView): GetRecipeView => ({
    recipe: toFullRecipeView(recipe),
    isStarred,
    isOwner
})

export default GetRecipeView
