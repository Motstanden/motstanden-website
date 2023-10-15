export interface StrippedSongLyric {
    id: number;
    title: string;
}

export interface SongLyric extends StrippedSongLyric {
    content: string;
}