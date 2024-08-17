import { FullRecipeViewWithRawText } from './FullRecipeView'

export interface MainImageUpdateSpec {
    username: string
    filename: string
}

interface UpdateRecipeSpec {
    title: string
    preparationTime: number | null
    cookingTime: number | null
    totalTime: number | null
    rawText: string
    isPublic: boolean
    mainImage: MainImageUpdateSpec | null
}

export const fromFullRecipeView = ({
    title,
    preparationTime,
    cookingTime,
    totalTime,
    rawText,
    isPublic,
    mainImage
}: FullRecipeViewWithRawText): UpdateRecipeSpec => ({
    title,
    preparationTime,
    cookingTime,
    totalTime,
    rawText,
    isPublic,
    mainImage:
        mainImage !== null
            ? {
                  username: mainImage.owner.username,
                  filename: mainImage.filename
              }
            : null
})

export default UpdateRecipeSpec
