import { createFileRoute } from '@tanstack/react-router'
import Recipe from '../../pages/recipe/Recipe'

export const Route = createFileRoute('/recipes/$username/$slug')({
    component: Recipe
})
