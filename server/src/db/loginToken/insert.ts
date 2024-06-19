import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function insert(userId: number, token: string, issuedAt: number, expireAt: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(
        `INSERT INTO 
            login_token(user_id, token, issued_at, expire_at)
        VALUES 
            (@userId, @token, @issuedAt, @expireAt)   
        `
    )
    stmt.run({
        userId: userId,
        token: token,
        issuedAt: issuedAt,
        expireAt: expireAt
    })
    db.close()
}