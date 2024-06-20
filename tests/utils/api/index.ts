import { commentsApi } from "./comments.js"
import { songLyricsApi } from "./songLyric.js"

export const api = {
    comments: {
        ...commentsApi
    },
    songLyrics: {
        ...songLyricsApi
    }
}