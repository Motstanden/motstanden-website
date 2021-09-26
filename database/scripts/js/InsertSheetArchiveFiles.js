// Run script: node InsertSheetArchiveFiles.js ../../motstanden_dev.db ../../dev_data/files

"use strict"
const fs = require('fs')
const path = require('path')

class Song {
    constructor(songDir){
        this.fullPath = songDir
        this.extraInfo = null
        this.prettyName = null
        this.files = []

        this.#ParseName();
        this.#GetFiles();
    }
    
    #ParseName = () => {
        let name = path.basename(this.fullPath)
                        .trim()

        let extraInfoRegEx = /_\(.*\)$/

        this.extraInfo = name.match(extraInfoRegEx)
                            ?.toString()
                             .replace(/[_\(\)]/g, "") 
                            ?? null;
        this.prettyName = name.replace(extraInfoRegEx, "")
                              .replace(/_/g, " ");
    }

    #GetFiles = () => {
        // TODO
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