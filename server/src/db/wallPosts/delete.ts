import Database, { Database as DatabaseType } from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deletePost(postId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            wall_post
        WHERE
            wall_post_id = ?
    `)
    stmt.run(postId)
    db.close()
}

export function deleteAllPostsByUser(userId: number, existingDbConnection?: DatabaseType) {
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadWriteConfig)
    
    const stmt = db.prepare(`
        DELETE FROM 
            wall_post
        WHERE
            created_by = @userId
    `)
    stmt.run({userId: userId})

    if (!existingDbConnection) {
        db.close()
    }
}

export function deleteAllPostsOnWall(wallUserId: number, existingDbConnection?: DatabaseType) {
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadWriteConfig)
    
    const stmt = db.prepare(`
        DELETE FROM 
            wall_post
        WHERE
            wall_user_id = @wallUserId
    `)
    stmt.run({wallUserId: wallUserId})

    if (!existingDbConnection) { 
        db.close()
    }
}