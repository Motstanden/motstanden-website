const path = require("path")

exports.dbFilename = path.join(__dirname, "..", "database", "motstanden.db")

exports.dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

exports.dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}