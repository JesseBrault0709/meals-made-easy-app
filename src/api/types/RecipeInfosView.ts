import RecipeInfoView, { RawRecipeInfoView } from './RecipeInfoView'

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

export default RecipeInfosView
