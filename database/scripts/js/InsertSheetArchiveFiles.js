// Run script: node InsertSheetArchiveFiles.js ../../sheet_archive_dev.db  ../../../server/files/private/notearkiv/

"use strict"
const fs = require('fs')
const path = require('path')
const { insertSong } = require("../../api/storedProcedures.js") 

class Song {
    constructor(songDir){
        this.fullPath = songDir
        this.extraInfo = null
        this.prettyName = null
        this.partSystem = null
        this.files = Song.GetFiles(this.fullPath);

        this.#ParseName();
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
    
    #ParseName = () => {
        let nameStr = path.basename(this.fullPath).trim()
        let parsedStr = Song.ParseNameStr(nameStr);
        this.prettyName = parsedStr.prettyName;
        this.extraInfo = parsedStr.extraInfo;
    }

    #CheckPartSystem = () => {
        let isSeven = this.files.some( file => file.partNumber === 6 || file.partNumber === 7)
        let isFive = this.files.some( file =>  file.partNumber >= 1  || file.partNumber <= 5)
        if(isSeven){
            this.partSystem = "5 part system"
        }
        else if(isFive){
            this.partSystem = "7 part system"
        }
        else {
            this.partSystem = null
        }
    }  
    
    static GetFiles = (fullPath) => {
        let files = fs.readdirSync(fullPath, { withFileTypes: true })
                      .filter(item => item.isFile())
                      .map(file => path.join(fullPath, file.name))

        let songFiles = []
        files.forEach(file => {
            songFiles.push(new SongFile(file))
        });
        return songFiles;
    }
}

class SongFile {
    constructor(fullPath){
        this.fullPath = fullPath
        this.urlPath = null
        this.prettyName = null
        this.extraInfo = null
        this.instrument = null
        this.instrumentVoice = null
        this.key = null
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

        let info = songInfo.split("_", numInfoFields)
        info = SongFile.#RightPadArray(info, numInfoFields);
        
        [this.instrument, this.instrumentVoice] = SongFile.#ParseInstrumentStr(info[0]);
        this.key = info[1]
        this.clef = SongFile.#ParseClefStr(info[2])
    }

    static #ParseInstrumentStr = (instrumentStr) => {
        let [instrument, voiceNum] = instrumentStr.trim().split("-", 2)

        // Handle special cases where the instrument name is not compatible with the database
        switch(instrument.toLowerCase()){
            // Instrument aliases
            case "altsax":
                instrument = "Altsaksofon"
                break;
            case "barysax":
                instrument = "Barytonsaksofon"
                break;
            case "fløyte":
                instrument = "Tverrfløyte"
                break;
            case "keyboard":
                instrument = "Tverrfløyte"
                break;
            case "sopransax":
                instrument = "Sopransaksofon"
                break;
            case "tenorsax":
                instrument = "Tenorsaksofon"
                break;
            // Part system
            case "part":
                this.partNumber = voiceNum[0]
                instrument = `${instrument} ${this.partNumber}`
                switch(voiceNum[1]?.toLowerCase()){
                    case "b":
                        voiceNum = 2
                        break;
                    default:
                        voiceNum = 1
                        break;
                }
                break;
        }

        voiceNum = voiceNum ? parseInt(voiceNum) : 1; 
        return [instrument, voiceNum]
    }

    static #ParseClefStr = (clefStr) => {
        if (!clefStr) 
            return "G-nøkkel";

        switch(clefStr.trim().toLowerCase()[0]){
            case 'g':
                return "G-nøkkel"
            case 'c':
                return "C-nøkkel";
            case 'f':
                return "F-nøkkel";
        }
    }

    static #RightPadArray = (array, finalLength) => {
        for(let i = array.length - 1; i < finalLength - 1; i++){
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
        song.files.forEach( songFile => {
            try {
                insertSong(song.prettyName, songFile.urlPath, songFile.clef, songFile.instrumentVoice, songFile.instrument, song.partSystem)
                successCount += 1
            }
            catch (err) {
                console.log(err, "\n")
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
                 .filter(fsItem => fsItem.isDirectory() )
                 .map(dir => path.join(__dirname, RootDir, dir.name))

    let songArray = dirs.map( dir => new Song(dir));

    DbInsertSongArray(songArray);
}

// Entry point for script
RunScript();