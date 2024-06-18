import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js";
import { JwtTokenData } from "../middleware/jwtAuthenticate.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

function insert(refreshToken: string) {
    const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtTokenData;

    const db = new Database(motstandenDB, dbReadWriteConfig);
    const stmt = db.prepare(
        `INSERT INTO 
            login_token(user_id, token, issued_at, expire_at)
        VALUES 
            (?, ?, ?, ?)   
        `
    );
    const info = stmt.run(jwtPayload.userId, refreshToken, jwtPayload.iat, jwtPayload.exp);
    db.close();
}

function exists(loginToken: string, userId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig);
    const stmt = db.prepare(
        `SELECT
            token
        FROM 
            login_token
        WHERE user_id = ?
        `
    );
    const tokens = <{ token: string; }[]>stmt.all(userId);
    db.close();
    const tokenMatch = tokens.find(item => item.token === loginToken);
    return !!tokenMatch;
}

function deleteToken(loginToken: string) {
    const db = new Database(motstandenDB, dbReadWriteConfig);
    const stmt = db.prepare(
        `DELETE FROM
            login_token
        WHERE token = ?`
    );
    const info = stmt.run(loginToken);
    db.close();
}

function deleteAllUserTokens(user: AccessTokenData) {
    const db = new Database(motstandenDB, dbReadWriteConfig);
    const stmt = db.prepare(
        `DELETE FROM
            login_token
        WHERE user_id = ?`
    );
    const info = stmt.run(user.userId);
    db.close();
}

export const loginTokenService = {
    insert: insert,
    exists: exists,
    delete: deleteToken,
    deleteAllUserTokens: deleteAllUserTokens
}