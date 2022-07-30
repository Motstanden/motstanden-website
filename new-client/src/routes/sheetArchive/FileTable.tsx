import React from "react";
import { ISongFile } from "./SheetArchive";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";

export function FileTable({ files }: { files: ISongFile[]; }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Instrument</TableCell>
                        <TableCell>Natura</TableCell>
                        <TableCell>Nøkkel</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { files.map( (file) => (
                        <TableRow key={file.url}>
                            <TableCell>
                                <Link 
                                    to={`/${file.url}`} 
                                    type="application/pdf" 
                                    reloadDocument>
                                    {formatFileName(file.instrument, file.instrumentVoice)}
                                </Link>
                            </TableCell>       
                            <TableCell>{file.transposition}</TableCell>       
                            <TableCell>{file.clef}</TableCell>       
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function formatFileName(instrument: string, voiceNum: number | undefined) : string {
    const isValidVoice = voiceNum && voiceNum > 1
    const isPart = instrument.toLowerCase().startsWith("part")
    if(!isValidVoice || isPart) {
        return instrument
    }   
    else {
        return `${instrument} ${voiceNum}` 
    }
}