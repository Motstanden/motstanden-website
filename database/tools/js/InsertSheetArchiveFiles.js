// Run script: node InsertSheetArchiveFiles.js ../../sheet_archive_dev.db  ../../../server/files/private/notearkiv/

"use strict"
const fs = require('fs')
const path = require('path')
const { insertSongFile, insertSongTitle } = require("./insertSong")

class Song {
    constructor(songDir) {
        this.fullPath = songDir
        this.urlPath = null
        this.extraInfo = null
        this.prettyName = null
        this.partSystem = null
        this.files = []

        this.#ParseUrl();
        this.#ParseName();
        this.#GetFiles();
        this.#CheckPartSystem();
    }

    static ParseNameStr = (nameStr) => {
        let extraInfoRegEx = /_\(.*\)$/

        let extraInfo = nameStr.match(extraInfoRegEx)
            ?.toString()
            .replace(/[_\(\)]/g, "")
            ?? null;
        let prettyName = nameStr.replace(extraInfoRegEx, "")
            .replace(/_/g, " ");
        return {
            prettyName: prettyName,
            extraInfo: extraInfo
        }
    }

    #ParseUrl = () => {
        let dirtyUrl = this.fullPath.match(/files.*/)[0];
        let posixUrl = dirtyUrl.split(path.sep).join(path.posix.sep)
        this.urlPath = posixUrl;
    }

    #ParseName = () => {
        let nameStr = path.basename(this.fullPath).trim()
        let parsedStr = Song.ParseNameStr(nameStr);
        this.prettyName = parsedStr.prettyName;
        this.extraInfo = parsedStr.extraInfo;
    }

    #GetFiles = () => {
        let files = fs.readdirSync(this.fullPath, { withFileTypes: true })
            .filter(item => item.isFile())
            .map(file => path.join(this.fullPath, file.name))

        let songFiles = []
        files.forEach(file => {
            if (path.extname(file).toLowerCase() === ".pdf") {
                songFiles.push(new SongFile(file))
            }
        });
        this.files = songFiles;
    }

    #CheckPartSystem = () => {
        let isSeven = this.files.some(file => file.partNumber === 6 || file.partNumber === 7)
        let isFive = this.files.some(file => file.partNumber >= 1 && file.partNumber <= 5)
        if (isSeven) {
            this.partSystem = "7 part system"
        }
        else if (isFive) {
            this.partSystem = "5 part system"
        }
        else {
            this.partSystem = null
        }
    }
}

class SongFile {
    constructor(fullPath) {
        this.fullPath = fullPath
        this.urlPath = null
        this.prettyName = null
        this.extraInfo = null
        this.instrument = null
        this.instrumentVoice = null
        this.transposition = null
        this.clef = null
        this.partNumber = null

        this.#ParseUrl(fullPath)

        let filename = path.basename(this.fullPath)
            .trim()
            .replace(".pdf", "")
        let [songName, songInfo] = filename.split("__", 2);

        this.#ParseSongName(songName);
        this.#PareSongInfo(songInfo);
    }

    #ParseUrl = fullPath => {
        let dirtyUrl = fullPath.match(/files.*/)[0];
        let posixUrl = dirtyUrl.split(path.sep).join(path.posix.sep)
        this.urlPath = posixUrl;
    }

    #ParseSongName = (songName) => {
        let parsedObj = Song.ParseNameStr(songName)
        this.prettyName = parsedObj.prettyName;
        this.extraInfo = parsedObj.extraInfo;
    }

    #PareSongInfo = (songInfo) => {
        const numInfoFields = 3;

        let info = songInfo?.split("_", numInfoFields)
        info = SongFile.#RightPadArray(info, numInfoFields);

        [this.instrument, this.instrumentVoice, this.partNumber] = SongFile.#ParseInstrumentStr(info[0]);
        this.transposition = info[1] ?? "C"
        this.clef = SongFile.#ParseClefStr(info[2])
    }

    static #ParseInstrumentStr = (instrumentStr) => {
        let [instrument, voiceNum] = instrumentStr.trim().split("-", 2)
        let partNumber = null

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
                partNumber = parseInt(voiceNum)
                instrument = `${instrument} ${partNumber}`
                switch (voiceNum[1]?.toLowerCase()) {
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

        voiceNum = !isNaN(parseInt(voiceNum)) ? parseInt(voiceNum) : 1;
        return [instrument, voiceNum, partNumber]
    }

    static #ParseClefStr = (clefStr) => {
        if (!clefStr)
            return "G-nøkkel";

        switch (clefStr.trim().toLowerCase()[0]) {
            case 'g':
                return "G-nøkkel"
            case 'c':
                return "C-nøkkel";
            case 'f':
                return "F-nøkkel";
        }
    }

    static #RightPadArray = (array, finalLength) => {
        for (let i = array.length - 1; i < finalLength - 1; i++) {
            array.push(null)
        }
        return array;
    }
}

// const DbName = process.argv[2];
const RootDir = process.argv[3];

// const DB = require('better-sqlite3')(DbName, { fileMustExist: true, verbose: console.log, readonly: false})
let successCount = 0
let failCount = 0

const DbInsertSongArray = (songArray) => {
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
                console.log(err, song.prettyName, "\n")
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
        .map(dir => path.join(__dirname, RootDir, dir.name))

    let songArray = dirs.map(dir => new Song(dir));

    DbInsertSongArray(songArray);
}

// Entry point for script
RunScript();