import Database, { Database as DatabaseType } from "better-sqlite3";
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

function get(postId: number): WallPost | undefined {
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

function insertNewPost(post: NewWallPost, userId: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO
            wall_post (content, wall_user_id, created_by)
        VALUES
            (?, ?, ?)
    `)
    return stmt.run(post.content, post.wallUserId, userId)
}

function insertUnreadPost(postId: number | bigint, userId: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO
            unread_wall_post (wall_post_id, user_id)
        VALUES
            (?, ?)
    `)
    stmt.run(postId, userId)
}

function insertPostAndMarkUnread(post: NewWallPost, userId: number) { 
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        
        // Insert new post
        const { lastInsertRowid } = insertNewPost(post, userId, db)

        // Get id of all users except current user
        const userIds = getAllUserIds(db)
            .filter(id => id.id !== userId)

        // Insert unread post for all users
        for(const { id } of userIds) { 
            insertUnreadPost(lastInsertRowid, id, db)
        }

    })
    startTransaction()
    db.close()
}

function getAllUserIds(db: DatabaseType) {
    const stmt = db.prepare(`
        SELECT
            user_id as id
        FROM
            user
    `)
    const userIds = stmt.all() as { id: number }[]
    return userIds
}


function deletePost(postId:number) {
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

function setContent(postId: number, content: string) { 
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE
            wall_post
        SET
            content = ?
        WHERE
            wall_post_id = ?
    `)
    stmt.run(content, postId)
    db.close()
}

function getUnreadCount(userId: number): number | undefined { 
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            count(*) as count
        FROM
            unread_wall_post
        WHERE
            user_id = ?
    `)
    const data = stmt.get(userId) as Count | undefined
    db.close()
    return data?.count
}

function resetUnreadCount(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            unread_wall_post 
        WHERE user_id = ?
    `)
    stmt.run(userId)
    db.close()
}

export const wallPostService = { 
    get: get,
    getAll: getAll,
    insertPostAndMarkUnread: insertPostAndMarkUnread,
    setContent: setContent,
    delete: deletePost,
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount,
}