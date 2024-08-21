import RecipeInfoView, { RawRecipeInfoView, toRecipeInfoView } from './RecipeInfoView'

export interface RawRecipeInfosView {
    pageNumber: number
    pageSize: number
    content: RawRecipeInfoView[]
}

interface RecipeInfosView {
    pageNumber: number
    pageSize: number
    content: RecipeInfoView[]
}

export const toRecipeInfosView = ({ pageNumber, pageSize, content }: RawRecipeInfosView): RecipeInfosView => ({
    pageNumber,
    pageSize,
    content: content.map(toRecipeInfoView)
})

export default RecipeInfosView
