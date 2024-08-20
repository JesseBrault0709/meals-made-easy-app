import AccessToken from '../types/AccessToken'

export const addBearer = (headers: Headers, accessToken: AccessToken) => {
    headers.set('Authorization', `Bearer ${accessToken.token}`)
}
