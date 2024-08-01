import { createFileRoute } from '@tanstack/react-router'
import Recipes from '../../pages/recipes/Recipes'

export const Route = createFileRoute('/_auth/recipes')({
    component: Recipes
})
