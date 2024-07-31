import { QueryClient } from '@tanstack/react-query'
import { AuthContextType } from './auth'

export default interface RouterContext {
    auth: AuthContextType
    queryClient: QueryClient
}
