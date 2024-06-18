import Database from "better-sqlite3";
import { WallPost } from "common/interfaces";
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js";

export function getAll(userId?: number): WallPost[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig);
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
    `);
    const posts = <WallPost[]>(userId ? stmt.all(userId) : stmt.all());
    db.close();

    return posts;
}
export function get(postId: number): WallPost | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig);
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
    `);
    const post = stmt.get(postId) as WallPost | undefined;
    db.close();

    return post;
}
