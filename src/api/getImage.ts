import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import apiCallFactory from './apiCallFactory'

export interface GetImageDeps {
    accessToken: AccessToken | null
    refresh: Refresh
    signal: AbortSignal
    url: string
}

const doGetImage = apiCallFactory('GET', {
    handleResponse: async res => URL.createObjectURL(await res.blob())
})

const getImage = async ({ accessToken, refresh, signal, url }: GetImageDeps) =>
    doGetImage({
        accessToken,
        refresh,
        signal,
        url
    })

export default getImage
