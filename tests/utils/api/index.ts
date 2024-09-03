import { commentsApi } from "./comments.js"
import { likesApi } from "./likes.js"
import { songLyricsApi } from "./songLyric.js"
import { usersApi } from "./users.js"
import { wallPostsApi } from "./wallPosts.js"

export const api = {
    comments: {
        ...commentsApi
    },
    likes: {
        ...likesApi
    },
    songLyrics: {
        ...songLyricsApi
    },
    users: {
        ...usersApi
    },
    wallPosts: {
        ...wallPostsApi
    }
}