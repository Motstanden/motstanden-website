const path = require("path")

const motstandenDBName = process.env.IS_DEV_ENV === 'true' 
                        ? 'motstanden_dev.db'
                        : 'motstanden.db'
const sheetArchiveDBName = process.env.IS_DEV_ENV === 'true' 
                        ? 'sheet_archive_dev.db'
                        : 'sheet_archive.db'

exports.motstandenDB   = path.join(__dirname, "..", "..",  "database", motstandenDBName)
exports.sheetArchiveDB = path.join(__dirname, "..", "..",  "database", sheetArchiveDBName)

exports.dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

exports.dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}