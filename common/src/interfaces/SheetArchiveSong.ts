import { Clef, Tone } from "../enums/index.js"

export interface NewSheetArchiveTitle { 
    title: string;
    extraInfo: string;
    isRepertoire: boolean;
}

export interface SheetArchiveTitle extends NewSheetArchiveTitle{
    id: number;
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