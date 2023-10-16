export interface StrippedSongLyric {
    id: number;
    title: string;
    isPopular: boolean;
}

export interface NewSongLyric {
    title: string;
    content: string;
    isPopular: boolean;
}

export interface SongLyric extends StrippedSongLyric {
    content: string;

    createdBy?: number;          // User id
    createdByName?: string;
    createdAt?: string;          // Format: 'YYYY-MM-DD HH-MM-SS'

    updatedBy?: number;          // User id
    updatedByName?: string;      
    updatedAt?: string;          // Format: 'YYYY-MM-DD HH-MM-SS'   
}