import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import apiCallFactory from './apiCallFactory'
import { GetRecipeViewWithRawText, toGetRecipeViewWithRawText } from './types/GetRecipeView'
import UpdateRecipeSpec from './types/UpdateRecipeSpec'

export interface UpdateRecipeDeps {
    spec: UpdateRecipeSpec
    accessToken: AccessToken
    refresh: Refresh
    username: string
    slug: string
}

const doUpdateRecipe = apiCallFactory('POST', toGetRecipeViewWithRawText)

const updateRecipe = ({
    spec,
    accessToken,
    refresh,
    username,
    slug
}: UpdateRecipeDeps): Promise<GetRecipeViewWithRawText> =>
    doUpdateRecipe({
        accessToken,
        body: spec,
        endpoint: `/recipes/${username}/${slug}`,
        refresh
    })

export default updateRecipe
