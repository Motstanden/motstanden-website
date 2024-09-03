import dotenv from "dotenv"
import { fileURLToPath } from 'url'

function resolvePath(relativePath: string) {
    return fileURLToPath(new URL(relativePath, import.meta.url))
}

dotenv.config( {path: resolvePath("../../.env")});

const motstandenDBName = process.env.IS_DEV_ENV === 'true' 
                        ? 'motstanden_dev.db'
                        : 'motstanden.db'
const sheetArchiveDBName = process.env.IS_DEV_ENV === 'true' 
                        ? 'sheet_archive_dev.db'
                        : 'sheet_archive.db'

export const motstandenDB: string   = fileURLToPath(new URL(`../../../database/${motstandenDBName}`, import.meta.url))
export const sheetArchiveDB: string = fileURLToPath(new URL(`../../../database/${sheetArchiveDBName}`, import.meta.url))

export const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

export const dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}