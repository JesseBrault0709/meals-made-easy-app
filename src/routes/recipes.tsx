import { createFileRoute } from '@tanstack/react-router'
import Recipes from '../pages/recipes/Recipes'

export const Route = createFileRoute('/recipes')({
    component: Recipes
})
