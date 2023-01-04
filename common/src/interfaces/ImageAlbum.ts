export interface ImageAlbum {
    id: number
    title: string
    url: string
    isPublic: boolean
    createdAt: string       // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string       // Format: 'YYYY-MM-DD HH-MM-SS'
    images: Image[]
    coverImageUrl: string
    imageCount: number
}

export interface NewImageAlbum extends Omit<ImageAlbum, "id" | "url" | "createdAt" | "updatedAt" | "images" | "imageCount" | "coverImageUrl"> {
    images: NewImage[]
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

export interface NewImage extends Omit<Image, "id" | "albumId" | "url" | "createdAt" | "updatedAt"> {}