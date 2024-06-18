import Database from "better-sqlite3"
import { Document } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

export function getAll(): Document[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            title, 
            filename AS url 
        FROM 
            document 
        ORDER BY 
            document_id DESC
        `)
    const documents = <Document[]>stmt.all()
    db.close()
    return documents
}
export function getAllPublic(): Document[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            title, 
            filename AS url 
        FROM 
            document 
        WHERE 
            is_public=1
        ORDER BY 
            document_id DESC`
    )
    const documents = <Document[]>stmt.all()
    db.close()
    return documents
}
