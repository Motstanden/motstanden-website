const path = require('path')

const motstandenDBName =  'motstanden_dev.db'

const sheetArchiveDBName = 'sheet_archive_dev.db'

const motstandenDB   = path.join(__dirname, "..", "..", motstandenDBName)
const sheetArchiveDB = path.join(__dirname, "..", "..", sheetArchiveDBName)

const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

const dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}

module.exports = {
    motstandenDBName: motstandenDBName,
    sheetArchiveDBName: sheetArchiveDBName,
    motstandenDB: motstandenDB,
    sheetArchiveDB: sheetArchiveDB,
    dbReadOnlyConfig: dbReadOnlyConfig,
    dbReadWriteConfig: dbReadWriteConfig
}