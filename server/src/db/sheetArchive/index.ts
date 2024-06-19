import { getSongFiles, getSongTitles } from "./get.js"
import { updateSongTitle } from "./update.js"


export const sheetArchiveDb = {
    
    titles: {
        getAll: getSongTitles,
        update: updateSongTitle      
    },

    files: {
        getAll: getSongFiles
    }
}