import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import apiCallFactory from './apiCallFactory'

export interface AddStarDeps {
    accessToken: AccessToken
    refresh: Refresh
    username: string
    slug: string
}

const doAddStar = apiCallFactory<void>('POST')

const addStar = ({ accessToken, refresh, username, slug }: AddStarDeps) =>
    doAddStar({
        accessToken,
        endpoint: `/recipes/${username}/${slug}/star`,
        refresh
    })

export default addStar
