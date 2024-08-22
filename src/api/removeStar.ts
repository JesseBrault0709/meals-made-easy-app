import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import apiCallFactory from './apiCallFactory'

export interface RemoveStarDeps {
    accessToken: AccessToken
    refresh: Refresh
    username: string
    slug: string
}

const doRemoveStar = apiCallFactory<void>('DELETE')

const removeStar = ({ accessToken, refresh, username, slug }: RemoveStarDeps) =>
    doRemoveStar({
        accessToken,
        endpoint: `/recipes/${username}/${slug}/star`,
        refresh
    })

export default removeStar
