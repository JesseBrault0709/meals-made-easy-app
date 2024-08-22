import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import apiCallFactory from './apiCallFactory'
import { toRecipeInfosView } from './types/RecipeInfosView'

export interface GetRecipeInfosDeps {
    accessToken: AccessToken | null
    pageNumber: number
    pageSize: number
    refresh: Refresh
    signal: AbortSignal
}

const doGetRecipeInfos = apiCallFactory('GET', toRecipeInfosView)

const getRecipeInfos = ({ accessToken, pageNumber, pageSize, refresh, signal }: GetRecipeInfosDeps) =>
    doGetRecipeInfos({
        accessToken,
        endpoint: `/recipes?page=${pageNumber}&size=${pageSize}`,
        refresh,
        signal
    })

export default getRecipeInfos
