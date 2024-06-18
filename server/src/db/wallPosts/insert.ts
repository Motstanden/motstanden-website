import Database, { Database as DatabaseType } from "better-sqlite3"
import { NewWallPost } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

function insertNewPost(post: NewWallPost, userId: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO
            wall_post (content, wall_user_id, created_by)
        VALUES
            (?, ?, ?)
    `);
    return stmt.run(post.content, post.wallUserId, userId);
}

function insertUnreadPost(postId: number | bigint, userId: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO
            unread_wall_post (wall_post_id, user_id)
        VALUES
            (?, ?)
    `);
    stmt.run(postId, userId);
}

export function insertPostAndMarkUnread(post: NewWallPost, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig);
    const startTransaction = db.transaction(() => {

        // Insert new post
        const { lastInsertRowid } = insertNewPost(post, userId, db);

        // Get id of all users except current user
        const userIds = getAllUserIds(db)
            .filter(id => id.id !== userId);

        // Insert unread post for all users
        for (const { id } of userIds) {
            insertUnreadPost(lastInsertRowid, id, db);
        }

    });
    startTransaction();
    db.close();
}

function getAllUserIds(db: DatabaseType) {
    const stmt = db.prepare(`
        SELECT
            user_id as id
        FROM
            user
    `);
    const userIds = stmt.all() as { id: number; }[];
    return userIds;
}