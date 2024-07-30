import UserInfoView from './UserInfoView'

interface ImageView {
    url: string
    created: string
    modified: string | null
    filename: string
    mimeType: string
    alt: string | null
    caption: string | null
    owner: UserInfoView
    isPublic: boolean
    viewers: UserInfoView[]
}

export default ImageView
