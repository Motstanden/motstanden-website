import {
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { SheetArchiveFile } from "common/interfaces";
import {
    Link as RouterLink
} from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { useTitle } from "../../hooks/useTitle";
import { useInstrumentContext } from "./Context";

export function InstrumentPage() {
    const {song, files} = useInstrumentContext()
    useTitle(song.title);
    
    return (
        <>
            <h1>{song.title}</h1>
            <div style={{ 
                maxWidth: "1300px",
                marginBottom: "150px", 
                marginTop: "30px" 
            }}>
                <FileTable files={files}/>
            </div>

        </>
    );
}

function FileTable({ files }: { files: SheetArchiveFile[]; }) {
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
                    {files.map((file) => (
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

function formatFileName(instrument: string, voiceNum: number | undefined): string {
    const isValidVoice = voiceNum && voiceNum > 1
    const isPart = instrument.toLowerCase().startsWith("part")
    if (!isValidVoice || isPart) {
        return instrument
    }
    else {
        return `${instrument} ${voiceNum}`
    }
}