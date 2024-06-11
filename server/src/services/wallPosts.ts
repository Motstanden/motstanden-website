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

function deletePost(postId: number) { 
    const db = new Database(motstandenDB, dbReadWriteConfig)
    executeDeletePost(postId, db)
    db.close()
}

function executeDeletePost(postId:number, db: DatabaseType) {
    const stmt = db.prepare(`
        DELETE FROM 
            wall_post
        WHERE
            wall_post_id = ?
    `)
    stmt.run(postId)
}

function deletePostTransaction(postId: number) { 
    const db = new Database(motstandenDB, dbReadWriteConfig)
    db.transaction(() => {
        executeDeletePost(postId, db)
        executeDecrementAllUnreadCount(db)
    })()
    db.close()
}

function getTotalCount(): number {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            count(*) as count 
        FROM 
            wall_post
    `)
    const data = stmt.get() as Count
    db.close()
    return data.count
}

function getUnreadCount(userId: number): number | undefined { 
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            count
        FROM
            vw_unread_wall_posts_count
        WHERE
            user_id = ?
    `)
    const data = stmt.get(userId) as Count | undefined
    db.close()
    return data?.count
}

function resetUnreadCount(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const totalCount = getTotalCount()
    const stmt = db.prepare(`
        INSERT INTO 
            read_wall_posts_count (user_id, count)
        VALUES 
            (?, ?)
        ON CONFLICT 
            (user_id) 
        DO UPDATE
            SET count = ?
    `)
    stmt.run(userId, totalCount, totalCount)
    db.close()
}

function incrementUnreadCount(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            read_wall_posts_count 
        SET 
            count = count + 1
        WHERE
            user_id = ?
    `)
    stmt.run(userId)
    db.close()
}

function decrementAllUnreadCount() {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    executeDecrementAllUnreadCount(db)
    db.close()
}

function executeDecrementAllUnreadCount(db: DatabaseType) {
    const stmt = db.prepare(`
        UPDATE 
            read_wall_posts_count 
        SET 
            count = CASE 
                WHEN count > 0 
                THEN count - 1
                ELSE 0
        END
    `)
    stmt.run()
}

export const wallPostService = { 
    get: get,
    getAll: getAll,
    insertNew: insertNew,
    delete: deletePostTransaction,
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount,
    incrementUnreadCount: incrementUnreadCount,
    decrementAllUnreadCount: decrementAllUnreadCount
}