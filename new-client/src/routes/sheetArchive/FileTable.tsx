import React from "react";
import { ISongFile } from "./SheetArchive";

export function FileTable({ files }: { files: ISongFile[]; }) {
    return (
        <ul>
            {files.map(file => <li key={file.url}>{file.url}</li>)}
        </ul>
    );
}
