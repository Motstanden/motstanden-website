import { commentsApi } from "./comments.js"
import { songLyricsApi } from "./songLyric.js"
import { usersApi } from "./users.js"

export const api = {
    comments: {
        ...commentsApi
    },
    songLyrics: {
        ...songLyricsApi
    },
    users: {
        ...usersApi
    }
}