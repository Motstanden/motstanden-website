// Run script: node insertSheetArchiveFiles.js ../../../../server/files/private/notearkiv/
import fs from 'fs'
import path from 'path'
import { insertSongFile, insertSongTitle } from "./insertSong.js"

type PartSystemType = "7 part system" | "5 part system" | null

class Song {

    fullPath: string
    urlPath: string
    extraInfo: string | null
    prettyName: string
    partSystem: PartSystemType
    files: SongFile[]

    constructor(songDir: string) {
        this.fullPath = songDir
        this.extraInfo = null

        this.urlPath = this.ParseUrl();
        
        const { prettyName, extraInfo } = this.ParseName();
        this.prettyName = prettyName;
        this.extraInfo = extraInfo;

        this.files = this.GetFiles();
        this.partSystem = this.CheckPartSystem();
    }

    static ParseNameStr = (nameStr: string) => {
        const extraInfoRegEx = /_\(.*\)$/

        const extraInfo = nameStr.match(extraInfoRegEx)
            ?.toString()
            .replace(/[_\(\)]/g, " ")
            ?? null;
        const prettyName = nameStr.replace(extraInfoRegEx, "")
            .replace(/_/g, " ");
        return {
            prettyName: prettyName,
            extraInfo: extraInfo
        }
    }

    private ParseUrl = (): string => {
        const dirtyUrl = this.fullPath.match(/files.*/)?.at(0);
        if(!dirtyUrl)
            throw `Could not parse url from path: ${this.fullPath}`
        const posixUrl = dirtyUrl.split(path.sep).join(path.posix.sep)
        return posixUrl;
    }

    private ParseName = (): { prettyName: string, extraInfo: string | null} => {
        const nameStr = path.basename(this.fullPath).trim()
        const parsedStr = Song.ParseNameStr(nameStr);
        return {
            prettyName: parsedStr.prettyName,
            extraInfo: parsedStr.extraInfo
        }
    }

    private GetFiles = (): SongFile[] => {
        const files = fs.readdirSync(this.fullPath, { withFileTypes: true })
            .filter(item => item.isFile())
            .map(file => path.join(this.fullPath, file.name))

        const songFiles: SongFile[] = []
        files.forEach(file => {
            if (path.extname(file).toLowerCase() === ".pdf") {
                songFiles.push(new SongFile(file))
            }
        });
        return songFiles;
    }

    private CheckPartSystem = (): PartSystemType => {
        let isSeven = this.files.some(file => file.partNumber === 6 || file.partNumber === 7)
        let isFive = this.files.some(file => file.partNumber !== null && file.partNumber >= 1 && file.partNumber <= 5)
        if (isSeven) {
            return "7 part system"
        }
        else if (isFive) {
            return "5 part system"
        }
        else {
            return null
        }
    }
}

type InstrumentStringData = {instrument: string, voiceNum: number, partNumber: number | null}
type SongStringData =  InstrumentStringData & {transposition: string, clef: string}

class SongFile {

    fullPath: string
    urlPath: string
    prettyName: string
    extraInfo: string | null
    instrument: string
    instrumentVoice: number
    transposition: string
    clef: string
    partNumber: number | null

    constructor(fullPath: string) {
        this.fullPath = fullPath

        this.urlPath = this.ParseUrl(fullPath)

        let filename = path.basename(this.fullPath)
            .trim()
            .replace(".pdf", "")
        let [songName, songInfo] = filename.split("__", 2);

        const {prettyName, extraInfo} = Song.ParseNameStr(songName);
        this.prettyName = prettyName;
        this.extraInfo = extraInfo;

        const songData = this.PareSongInfo(songInfo);
        this.instrument = songData.instrument;
        this.instrumentVoice = songData.voiceNum;
        this.transposition = songData.transposition;
        this.clef = songData.clef;
        this.partNumber = songData.partNumber;
    }

    private ParseUrl = (fullPath: string): string => {

        const dirtyUrl = fullPath.match(/files.*/)?.at(0);
        if(!dirtyUrl)
            throw `Could not parse url from path: ${fullPath}`

        const posixUrl = dirtyUrl.split(path.sep).join(path.posix.sep)
        return posixUrl
    }
    
    private PareSongInfo = (songInfo: string): SongStringData => {
        const numInfoFields = 3;

        let info: (string | null)[] = songInfo?.split("_", numInfoFields)
        info = SongFile.#RightPadArray(info, null, numInfoFields);

        const instrumentInfo = info[0]
        if(!instrumentInfo)
            throw `Could not parse instrument info from string: ${songInfo}`;

        const data = {
            ...SongFile.ParseInstrumentStr(instrumentInfo),
            transposition: info[1] ?? "C",
            clef: SongFile.#ParseClefStr(info[2])
        }

        return data
    }

    private static ParseInstrumentStr = (instrumentStr: string): InstrumentStringData => {
        let [instrument, voiceNumStr] = instrumentStr.trim().split("-", 2)
        let partNumber = null
        let voiceNum = null

        // Handle special cases where the instrument name is not compatible with the database
        switch (instrument.toLowerCase()) {
            // Instrument aliases
            case "altsax":
                instrument = "Altsaksofon"
                break;
            case "altsaxofon":
                instrument = "Altsaksofon"
                break;
            case "barysax":
                instrument = "Barytonsaksofon"
                break;
            case "bassaxofon":
                instrument = "Bassaksofon"
                break;
            case "elgitar":
                instrument = "Gitar"
                break;
            case "euphonium":
                instrument = "Eufonium"
                break
            case "fløyte":
                instrument = "Tverrfløyte"
                break;
            case "keyboard":
                instrument = "Piano"
                break;
            case "pikkolo":
                instrument = "Pikkolofløyte"
                break;
            case "sopransax":
                instrument = "Sopransaksofon"
                break;
            case "symbal":
                instrument = "Symbaler"
                break;
            case "tenorsax":
                instrument = "Tenorsaksofon"
                break;
            case "barytone":
                instrument = "Baryton"
                break;
            // Part system
            case "part":
                partNumber = parseInt(voiceNumStr)
                instrument = `${instrument} ${partNumber}`
                switch (voiceNumStr[1]?.toLowerCase()) {
                    case "b":
                        voiceNum = 2
                        break;
                    default:
                        voiceNum = 1
                        break;
                }
                break;
            default:
                break
        }

        if(voiceNum === null) {
            const value = parseInt(voiceNumStr)
            voiceNum = isNaN(value) ? 1 : value
        }

        return {
            instrument: instrument,
            voiceNum: voiceNum,
            partNumber: partNumber
        }
    }

    static #ParseClefStr = (clefStr: string | null) => {
        if (!clefStr)
            return "G-nøkkel";

        switch (clefStr.trim().toLowerCase()[0]) {
            case 'g':
                return "G-nøkkel"
            case 'c':
                return "C-nøkkel";
            case 'f':
                return "F-nøkkel";
            default:
                throw `Could not parse clef from string: ${clefStr}`
        }
    }

    static #RightPadArray = <T,>(array: T[], value: T, finalLength: number): T[] => {
        for (let i = array.length - 1; i < finalLength - 1; i++) {
            array.push(value)
        }
        return array;
    }
}

const RootDir = process.argv[2];

let successCount = 0
let failCount = 0

const DbInsertSongArray = (songArray: Song[]) => {
    songArray.forEach(song => {
        try {
            insertSongTitle(song.prettyName, song.extraInfo, song.urlPath)
        }
        catch (err) {
            console.log(err, "\t", song.prettyName, "\n")
            failCount += 1
            return              // Continue to the next item in the foreach loop
        }

        song.files.forEach(songFile => {
            try {
                insertSongFile(song.prettyName, song.extraInfo, songFile.urlPath, songFile.clef, songFile.instrumentVoice, songFile.instrument, songFile.transposition, song.partSystem)
                successCount += 1
            }
            catch (err) {
                console.log(err, "\n", "Song: ", song, "\n")
                failCount += 1
            }
        })
    })

    console.log(`Success count: ${successCount}`)
    console.log(`Failure count: ${failCount}`)
}

// Entry point for script
const RunScript = () => {
    let dirs = fs.readdirSync(RootDir, { withFileTypes: true })
        .filter(fsItem => fsItem.isDirectory())
        .map(dir => path.join(import.meta.dirname, RootDir, dir.name))

    let songArray = dirs.map(dir => new Song(dir));

    DbInsertSongArray(songArray);
}

// Entry point for script
RunScript();