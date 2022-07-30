import React from "react";
import { ISongFile } from "./SheetArchive";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Link as RouterLink } from "react-router-dom";
import Link  from "@mui/material/Link";

const headerStyle = {
    backgroundColor: "secondary.main",
    "& th": {
        fontSize: 14, 
        fontWeight: "bold", 
        textTransform: "uppercase", 
        color: "secondary.contrastText"}
}

const rowStyle = {
    // Alternating background color
    '&:nth-of-type(odd)': {
        backgroundColor: "action.hover",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}

const linkStyle = {
    color: "primary.light",
    "&:visited": {
        color: "primary.dark"
    },
    "&:hover": {
        color: "primary.main"
    },
}

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