export interface ImageAlbum {
    id: number
    title: string
    url: string
    isPublic: boolean
    images: Image[]
    coverImageUrl: string
    imageCount: number
 
    createdByUserId: number
    createdByName: string
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'

    updatedByUserId: number
    updatedByName: string
    updatedAt: string          // Format: 'YYYY-MM-DD HH-MM-SS'
}

export interface NewImageAlbum 
extends Omit<ImageAlbum, 
    "id"                | 
    "url"               | 
    "images"            | 
    "imageCount"        | 
    "coverImageUrl"     |
    
    "createdByUserId"   |
    "createdByName"     |
    "createdAt"         |

    "updatedByUserId"   |
    "updatedByName"     |
    "updatedAt"         
    > {

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