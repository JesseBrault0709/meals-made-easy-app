import UserInfoView from './UserInfoView'

export interface RawImageView {
    url: string
    created: string
    modified: string | null
    filename: string
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

export const toImageView = ({
    url,
    created: rawCreated,
    modified: rawModified,
    filename,
    mimeType,
    alt,
    caption,
    owner,
    isPublic
}: RawImageView): ImageView => ({
    url,
    created: new Date(rawCreated),
    modified: rawModified ? new Date(rawModified) : null,
    filename,
    mimeType,
    alt,
    caption,
    owner,
    isPublic
})

export default ImageView
