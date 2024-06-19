import { deleteLyric } from "./delete.js"
import { get, getSimplifiedList } from "./get.js"
import { insertLyric } from "./insert.js"
import { update } from "./update.js"

export const songLyricsDb = {
    getSimplifiedList: getSimplifiedList,
    get: get,
    insert: insertLyric,
    update: update,
    delete: deleteLyric
}