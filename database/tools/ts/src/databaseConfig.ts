import path from 'path'

export const motstandenDBName = 'motstanden_dev.db'

export const sheetArchiveDBName = 'sheet_archive_dev.db'

export const motstandenDB = path.join(import.meta.dirname, "..", "..", "..", motstandenDBName)
export const sheetArchiveDB = path.join(import.meta.dirname, "..", "..", "..", sheetArchiveDBName)

export const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

export const dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}