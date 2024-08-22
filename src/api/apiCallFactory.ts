import AccessToken from '../types/AccessToken'
import Refresh from '../types/Refresh'
import { ApiError } from './ApiError'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiCallFactoryDeps<T> = WithHandleJson<T> | WithHandleResponse<T>

export interface WithHandleJson<T> {
    handleJson: (raw: any) => T
}

export interface WithHandleResponse<T> {
    handleResponse: (response: Response) => Promise<T> | T
}

export type ApiCallDeps = {
    accessToken: AccessToken | null
    refresh: Refresh
    signal?: AbortSignal
    body?: any
} & (WithEndpoint | WithUrl)

export interface WithEndpoint {
    endpoint: string
    query?: string
}

export interface WithUrl {
    url: string
}

export type ApiCall<T> = (deps: ApiCallDeps) => Promise<T>

export interface ApiCallFactory<T> {
    (method: Method): ApiCall<void>
    (method: Method, handleBody: (raw: any) => T): ApiCall<T>
    (method: Method, deps: ApiCallFactoryDeps<T>): ApiCall<T>
}

const handleResult = async <T>(
    handleBodyOrDeps: ((raw: any) => T) | ApiCallFactoryDeps<T>,
    response: Response
): Promise<T> => {
    if (typeof handleBodyOrDeps === 'function') {
        return handleBodyOrDeps(await response.json())
    } else {
        const deps = handleBodyOrDeps
        if ('handleResponse' in deps) {
            return deps.handleResponse(response)
        } else {
            return deps.handleJson(await response.json())
        }
    }
}

const apiCallFactory = <T>(
    method: Method,
    handleBodyOrDeps?: ((raw: any) => T) | ApiCallFactoryDeps<T>
): ApiCall<typeof handleBodyOrDeps extends undefined ? void : T> => {
    return (async (deps: ApiCallDeps): Promise<void | T> => {
        const { accessToken, refresh, signal } = deps
        const headers = new Headers()
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken.token}`)
        }
        if (deps.body) {
            headers.set('Content-type', 'application/json')
        }
        const url =
            'url' in deps
                ? deps.url
                : deps.query
                  ? import.meta.env.VITE_MME_API_URL + deps.endpoint + '?' + deps.query
                  : import.meta.env.VITE_MME_API_URL + deps.endpoint
        const body = deps.body ? JSON.stringify(deps.body) : undefined
        const response = await fetch(url, {
            body,
            signal,
            headers,
            mode: 'cors',
            method
        })
        if (response.ok && handleBodyOrDeps) {
            return handleResult(handleBodyOrDeps, response)
        } else if (response.status === 401) {
            const newToken = await refresh()
            if (newToken === null) {
                throw new ApiError(401, 'Could not get a refreshed access token.')
            }
            headers.set('Authorization', `Bearer ${newToken.token}`)
            const retry = await fetch(url, {
                body,
                signal,
                headers,
                mode: 'cors',
                method
            })
            if (retry.ok && handleBodyOrDeps) {
                return handleResult(handleBodyOrDeps, retry)
            } else if (!retry.ok) {
                throw new ApiError(retry.status, retry.statusText)
            }
        } else if (!response.ok) {
            throw new ApiError(response.status, response.statusText)
        }
    }) as ApiCall<T>
}

export default apiCallFactory
