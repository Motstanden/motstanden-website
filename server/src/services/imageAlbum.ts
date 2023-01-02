import Database from "better-sqlite3"
import { Image, ImageAlbum } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js"

interface DbImageAlbum extends Omit<ImageAlbum, "isPublic"> {
    isPublic: number
}

interface DbImage extends Omit<Image, "isPublic"> {
    isPublic: number
}

export function getAll(limit?: number): ImageAlbum[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            image_album_id as id, 
            title, 
            url,
            is_public as isPublic,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            image_album 
        ORDER BY 
            created_at DESC
        ${!!limit ? "LIMIT ?" : ""}
    `)
    const dbAlbums: DbImageAlbum[] | undefined = !!limit ? stmt.all(limit) : stmt.all()
    db.close()
    
    if(!dbAlbums)
        throw "Bad data"
        
    const albums = dbAlbums.map( item => ({
        ...item, 
        isPublic: item.isPublic === 1 
    }))

    return albums 
}

function get( id: number): Image[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            image_id as id,
            image_album_id as albumId,
            caption,
            filename as url,
            is_public as isPublic,
            created_at as createdAt,
            updated_at as updatedAt
        FROM
            image
        WHERE image_album_id = ?
    `)
    const dbResult: DbImage[] = stmt.all(id)
    db.close()

    if (!dbResult)
        throw "Bad data"

    const image: Image[] = dbResult.map( item => ({
        ...item,
        isPublic: item.isPublic === 1
    }))
    
    return image
}

export const imageAlbumService = {
    getAll: getAll,
    get: get
}