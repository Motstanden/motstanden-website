import { commentsApi } from "./comments.js"
import { eventsApi } from "./events.js"
import { likesApi } from "./likes.js"
import { pollsApi } from "./polls.js"
import { songLyricsApi } from "./songLyric.js"
import { usersApi } from "./users.js"
import { wallPostsApi } from "./wallPosts.js"

export const api = {
    events: {
        ...eventsApi
    },
    comments: {
        ...commentsApi
    },
    likes: {
        ...likesApi
    },
    polls: {
        ...pollsApi
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