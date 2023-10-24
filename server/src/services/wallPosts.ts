import Database from "better-sqlite3";
import { WallPost } from "common/interfaces";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js";

interface DbWallPost extends Omit<WallPost, "comments"> {}


// This function can probably be optimized a lot.
// Right now, the function selects all wall posts from the database, and then for each post, it selects all comments for that post.
// It is probably faster to run a single query that selects all wall posts and all comments, and then map the comments to the correct wall post.
// This would be more complex, but it would probably be faster.
// Lets wait and see if this is a problem before we optimize it.
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
    const posts: WallPost[] = userId ? stmt.all(userId) : stmt.all()
    db.close()
    
    return posts
}

export const wallPostService = { 
    getAll: getAll,
}