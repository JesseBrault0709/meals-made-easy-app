import AccessToken from './AccessToken'

interface Refresh {
    (): Promise<AccessToken | null>
}

export default Refresh
