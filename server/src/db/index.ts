import { commentsDb } from "./comments/index.js"
import { documentsDb } from "./documents/index.js"
import { eventsDb } from "./events/index.js"
import { likesDb } from "./likes/index.js"
import { loginTokenDb } from "./loginToken/index.js"
import { pollsDb } from "./polls/index.js"
import { quotesDb } from "./quotes/index.js"
import { rumourDb } from "./rumours/index.js"
import { sheetArchiveDb } from "./sheetArchive/index.js"
import { simpleTextDb } from "./simpleText/index.js"
import { songLyricsDb } from "./songLyrics/index.js"
import { usersDb } from "./users/index.js"
import { wallPostDb } from "./wallPosts/index.js"

export const db = {
    comments: {
        ...commentsDb,
    },
    documents: {
        ...documentsDb
    },
    events: {
        ...eventsDb
    },
    likes: {
        ...likesDb   
    },
    loginTokens: {
        ...loginTokenDb
    },
    polls: {
        ...pollsDb
    },
    quotes: {
        ...quotesDb
    },
    rumours: {
        ...rumourDb
    },
    sheetArchive: {
        ...sheetArchiveDb       
    },
    simpleTexts: {
        ...simpleTextDb
    },
    songLyrics: {
        ...songLyricsDb
    },
    users: {
        ...usersDb
    },
    wallPosts: {
        ...wallPostDb
    }
}