import { deleteQuote } from "./delete.js"
import { getAll, getQuoteAuthorInfo } from "./get.js"
import { insertQuote } from "./insert.js"
import { updateQuote } from "./update.js"

export const quotesDb = {
    getAuthorInfo: getQuoteAuthorInfo,
    getAll: getAll,
    delete: deleteQuote,
    insert: insertQuote,
    update: updateQuote
}