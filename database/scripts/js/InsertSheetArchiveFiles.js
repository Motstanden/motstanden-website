// Run script: node InsertSheetArchiveFiles.js ../../motstanden_dev.db ../../dev_data/files

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
        this.prettyName = null
        this.extraInfo = null
        this.instrument = null
        this.instrumentVoice = null
        this.key = null
        this.clef = null

        let filename = path.basename(this.fullPath)
                            .trim()
                            .replace(".pdf", "")
        let [songName, songInfo] = filename.split("__", 2);
        
        this.#ParseSongName(songName);
        this.#PareSongInfo(songInfo);

        console.log(this)
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
        
        [this.instrument, this.voiceNum] = SongFile.#ParseInstrumentStr(info[0]);
        this.key = info[1]
        this.clef = info[2]
    }

    static #ParseInstrumentStr = (instrumentStr) => {
        // TODO
        let instrument = instrumentStr
        let voiceNum = null
        return [instrument, voiceNum]
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

const RunScript = () => {
    let dirs = fs.readdirSync(RootDir, { withFileTypes: true })
                 .filter(fsItem => fsItem.isDirectory() )
                 .map(dir => path.join(__dirname, RootDir, dir.name))
                 
    dirs.forEach( (dir, i) => {
        let song = new Song(dir)
    })
}

RunScript();