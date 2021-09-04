const path = require("path")

const dbShortName = process.env.IS_DEV_ENV === 'true' 
                  ? 'motstanden_dev.db'
                  : 'motstanden.db'

exports.dbFilename = path.join(__dirname, "..", "database", dbShortName)

exports.dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

exports.dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}