import { APIRequestContext } from "@playwright/test"
import { NewSongLyric } from "common/interfaces"

async function createSongLyric(api: APIRequestContext, lyric: NewSongLyric) {
    const res = await api.post("/api/lyrics", { data: lyric })
    if (!res.ok()) {
        throw new Error(`Failed to create song lyric.\n${await res.text()}`)
    }
}

export const songLyricsApi = {
    new: createSongLyric
}