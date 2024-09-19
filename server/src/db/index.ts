import { commentsDb } from "./comments/index.js"
import { documentsDb } from "./documents/index.js"
import { eventsDb } from "./events/index.js"
import { feedDb } from "./feed/index.js"
import { likesDb } from "./likes/index.js"
import { pollsDb } from "./polls/index.js"
import { quotesDb } from "./quotes/index.js"
import { rumoursDb } from "./rumours/index.js"
import { sheetArchiveDb } from "./sheetArchive/index.js"
import { simpleTextsDb } from "./simpleTexts/index.js"
import { songLyricsDb } from "./songLyrics/index.js"
import { usersDb } from "./users/index.js"
import { wallPostsDb } from "./wallPosts/index.js"

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
    feed: {
        ...feedDb
    },
    likes: {
        ...likesDb   
    },
    polls: {
        ...pollsDb
    },
    quotes: {
        ...quotesDb
    },
    rumours: {
        ...rumoursDb
    },
    sheetArchive: {
        ...sheetArchiveDb       
    },
    simpleTexts: {
        ...simpleTextsDb
    },
    songLyrics: {
        ...songLyricsDb
    },
    users: {
        ...usersDb
    },
    wallPosts: {
        ...wallPostsDb
    }
}