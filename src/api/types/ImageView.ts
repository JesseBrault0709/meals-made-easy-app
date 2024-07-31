import UserInfoView from './UserInfoView'

export interface RawImageView {
    url: string
    created: string
    modified: string | null
    fileName: string
    mimeType: string
    alt: string | null
    caption: string | null
    owner: UserInfoView
    isPublic: boolean
}

interface ImageView {
    url: string
    created: Date
    modified: Date | null
    filename: string
    mimeType: string
    alt: string | null
    caption: string | null
    owner: UserInfoView
    isPublic: boolean
}

export default ImageView
