// Run script: node InsertSheetArchiveFiles.js ../../sheet_archive_dev.db  ../../../server/files/private/notearkiv/

"use strict"
const fs = require('fs')
const path = require('path')

class Song {
    constructor(songDir){
        this.fullPath = songDir
        this.extraInfo = null
        this.prettyName = null
        this.files = Song.GetFiles(this.fullPath);

        this.#ParseName();
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
        voiceNum = voiceNum ? parseInt(voiceNum) : 1;            
        return [instrument, voiceNum]
    }

    static #ParseClefStr = (clefStr) => {
        if (!clefStr) 
            return null;

        switch(clefStr.trim().toLowerCase()[0]){
            case 'g':
                return "G-nøkkel"
            case 'c':
                return "C-nøkkel";
            case 'f':
                return "F-nøkkel";
            default:
                return null;
        }
    }

    static #RightPadArray = (array, finalLength) => {
        for(let i = array.length - 1; i < finalLength - 1; i++){
            array.push(null)
        }
        return array;
    }
}

const DbName = process.argv[2];
const RootDir = process.argv[3];

const DB = require('better-sqlite3')(DbName, { fileMustExist: true, verbose: console.log, readonly: false})

const DbInsertSongArray = (songArray) => {  
    songArray.forEach(song => {
        song.files.forEach( songFile => {
            
            const stmt = DB.prepare("INSERT INTO \
                                        vw_song_file(title, filename, clef_name, instrument_voice, instrument) \
                                    VALUES  (?, ?, ?, ?, ?);")
            stmt.run(song.prettyName, songFile.urlPath, songFile.clef, songFile.instrumentVoice, songFile.instrument)

        })
    })
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