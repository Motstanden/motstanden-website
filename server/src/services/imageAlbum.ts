import Database from "better-sqlite3"
import { Image, ImageAlbum } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js"

interface DbImageAlbum extends Omit<ImageAlbum, "isPublic"> {
    isPublic: number
}

interface DbImage extends Omit<Image, "isPublic"> {
    isPublic: number
}

function getAll(limit?: number): ImageAlbum[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            image_album_id as id, 
            title, 
            url,
            is_public as isPublic,
            cover_image_url as coverImageUrl,
            image_count as imageCount,

            created_by_user_id as createdByUserId,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedByUserId,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt

        FROM 
            vw_image_album 
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
        isPublic: item.isPublic === 1,
        images: []
    }))

    return albums 
}

function get(albumId: number): ImageAlbum {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            image_album_id as id, 
            title, 
            url,
            is_public as isPublic,
            cover_image_url as coverImageUrl,
            image_count as imageCount,

            created_by_user_id as createdByUserId,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedByUserId,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt
        FROM 
            vw_image_album 
        WHERE image_album_id = ?
    `)
    const dbAlbum: DbImageAlbum | undefined = stmt.get(albumId)
    db.close()
    
    if(!dbAlbum)
        throw "Bad data"
        
    const album = {
        ...dbAlbum, 
        isPublic: dbAlbum.isPublic === 1,
        images: []
    }

    return album 
}

function getImages( albumId: number): Image[] {
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
    const dbResult: DbImage[] = stmt.all(albumId)
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
    get: get,
    getAll: getAll,
    getImages: getImages
}