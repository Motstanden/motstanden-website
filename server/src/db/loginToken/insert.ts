import Database from "better-sqlite3"
import jwt from "jsonwebtoken"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { JwtTokenData } from "../../middleware/jwtAuthenticate.js"

export function insert(refreshToken: string) {
    const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtTokenData

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(
        `INSERT INTO 
            login_token(user_id, token, issued_at, expire_at)
        VALUES 
            (?, ?, ?, ?)   
        `
    )
    const info = stmt.run(jwtPayload.userId, refreshToken, jwtPayload.iat, jwtPayload.exp)
    db.close()
}

