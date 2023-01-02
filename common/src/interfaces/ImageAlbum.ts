export interface ImageAlbum {
    id: number
    title: string
    url: string
    isPublic: boolean
    createdAt: string       // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string       // Format: 'YYYY-MM-DD HH-MM-SS'
    images: Image[]
}

export interface Image {
    id: number
    albumId: number
    caption: string
    url: string
    isPublic: boolean
    createdAt: string       // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string       // Format: 'YYYY-MM-DD HH-MM-SS'
}