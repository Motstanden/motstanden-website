// TODO: Refactor this into /common

export interface ISongInfo {
    url: string,
    title: string,
    extraInfo: string,
    titleId: number
    isRepertoire: number    // 1 = true, 0 = false
}

export interface ISongFile {
    url: string,
    clef: string,
    instrument: string,
    instrumentVoice: number,
    transposition: string
}