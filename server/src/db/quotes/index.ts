import { deleteQuote } from "./delete.js"
import { getAll, getQuote } from "./get.js"
import { insertQuote } from "./insert.js"
import { updateQuote } from "./update.js"

export const quotesDb = {
    get: getQuote,
    getAll: getAll,
    delete: deleteQuote,
    insert: insertQuote,
    update: updateQuote
}