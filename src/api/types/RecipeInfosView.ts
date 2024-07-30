import { RecipeInfoView } from './types/RecipeInfoView'

export interface RecipeInfosView {
    pageNumber: number
    pageSize: number
    content: RecipeInfoView[]
}
