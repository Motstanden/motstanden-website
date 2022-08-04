import dotenv from "dotenv";
dotenv.config();

import path from "path";

const motstandenDBName = process.env.IS_DEV_ENV === 'true' 
                        ? 'motstanden_dev.db'
                        : 'motstanden.db'
const sheetArchiveDBName = process.env.IS_DEV_ENV === 'true' 
                        ? 'sheet_archive_dev.db'
                        : 'sheet_archive.db'

export const motstandenDB   = path.join(__dirname, "..", "..", "..",  "database", motstandenDBName)
export const sheetArchiveDB = path.join(__dirname, "..", "..", "..",  "database", sheetArchiveDBName)

export const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

export const dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}