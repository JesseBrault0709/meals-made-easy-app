import { Route } from '../../routes/recipes_/$username.$slug'

export interface RecipeProps {}

const Recipe = ({}: RecipeProps) => {
    const { username, slug } = Route.useParams()
    return (
        <>
            Hello, {username}/{slug}
        </>
    )
}

export default Recipe
