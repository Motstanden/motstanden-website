import Database from "better-sqlite3";
import { Count, NewWallPost, WallPost } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js";

function getAll(userId?: number): WallPost[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            wall_post_id as id,
            wall_user_id as wallUserId,
            content,
            created_by as createdBy,
            created_at as createdAt
        FROM 
            wall_post
        ${userId ? "WHERE wall_user_id = ?" : ""}
        ORDER BY created_at DESC
    `)
    const posts = <WallPost[]>( userId ? stmt.all(userId) : stmt.all() )
    db.close()
    
    return posts
}

function get(postId: number): WallPost |undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            wall_post_id as id,
            wall_user_id as wallUserId,
            content,
            created_by as createdBy,
            created_at as createdAt
        FROM 
            wall_post
        WHERE
            wall_post_id = ?
    `)
    const post = stmt.get(postId) as WallPost | undefined 
    db.close()
    
    return post
}

function getCount(): Count {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT count(*) as count FROM wall_post
    `)
    const data = stmt.get() as Count
    db.close()
    return data
}

function insertNew(post: NewWallPost, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO
            wall_post (content, wall_user_id, created_by)
        VALUES
            (?, ?, ?)
    `)
    stmt.run(post.content, post.wallUserId, userId)
    db.close()
}

export const wallPostService = { 
    get: get,
    getAll: getAll,
    getCount: getCount,
    insertNew: insertNew
}