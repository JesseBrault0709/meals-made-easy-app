import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import { ApiError } from './ApiError'

export interface ApiCallDeps {
    accessToken: AccessToken | null
    endpoint: string
    query?: string
    refresh: Refresh
    signal: AbortSignal
    body?: any
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const getApiCallFactory =
    (method: Method) =>
    <T>(handleBody?: (raw: any) => T) =>
    async ({ accessToken, endpoint, refresh, signal, body }: ApiCallDeps): Promise<T> => {
        const headers = new Headers()
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken.token}`)
        }
        if (body) {
            headers.set('Content-type', 'application/json')
        }
        const url = import.meta.env.VITE_MME_API_URL + endpoint
        const response = await fetch(url, {
            body: body ? JSON.stringify(body) : undefined,
            signal,
            headers,
            mode: 'cors',
            method
        })
        if (response.ok && handleBody) {
            return handleBody(await response.json())
        } else if (response.status === 401) {
            const newToken = await refresh()
            if (newToken === null) {
                throw new ApiError(401, 'Could not get a refreshed access token.')
            }
            headers.set('Authorization', `Bearer ${newToken.token}`)
            const retry = await fetch(url, {
                signal,
                headers,
                mode: 'cors',
                method
            })
            if (retry.ok && handleBody) {
                return handleBody(await retry.json())
            } else {
                throw new ApiError(retry.status, retry.statusText)
            }
        } else {
            throw new ApiError(response.status, response.statusText)
        }
    }

export const getCallFactory = getApiCallFactory('GET')
export const postCallFactory = getApiCallFactory('POST')
export const putCallFactory = getApiCallFactory('PUT')
export const deleteCallFactory = getApiCallFactory('DELETE')
