import React from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';

import { ISongFile } from './SheetArchive';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';


export function FileTable({ files }: { files: ISongFile[]; }) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>Instrument</TableCell>
                        <TableCell>Natura</TableCell>
                        <TableCell>Nøkkel</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { files.map( (file) => (
                        <TableRow key={file.url} sx={rowStyle}>
                            <TableCell>
                                <Link 
                                    component={RouterLink}
                                    to={`/${file.url}`} 
                                    type="application/pdf" 
                                    reloadDocument
                                    underline="hover"
                                    sx={linkStyle}>
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