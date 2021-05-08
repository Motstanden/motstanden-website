const path = require("path")

exports.dbFilename = path.join(__dirname, "motstanden.db")

exports.dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

exports.dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}