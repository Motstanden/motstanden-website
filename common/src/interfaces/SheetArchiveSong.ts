import { Clef, Tone } from "../enums/index.js";

export interface SheetArchiveTitle {
    id: number;
    title: string;
    extraInfo: string;
    isRepertoire: boolean;
    isPublic: boolean;
    url: string;
}

// TODO: Add missing fields
export interface SheetArchiveFile {
    id: number;
    clef: Clef;
    url: string;
    instrument: string;
    instrumentVoice: number; 
    transposition: Tone,
}