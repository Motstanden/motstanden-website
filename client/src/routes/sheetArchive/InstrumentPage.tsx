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
import { useQuery } from '@tanstack/react-query';
import { SheetArchiveFile, SheetArchiveTitle } from "common/interfaces";
import {
    Navigate,
    Link as RouterLink,
    useOutletContext,
    useParams
} from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { useTitle } from "../../hooks/useTitle";
import { fetchFn } from "../../utils/fetchAsync";

export default function InstrumentPage() {
    const { title } = useParams();
    const songData = useOutletContext<SheetArchiveTitle[]>();
    const song = songData.find(item => title && item.url.endsWith(title))
    useTitle(song?.title);
    
    if(!song)
        return <Navigate to="/notearkiv" replace={true}  />
    
    return (
        <>
            <h2>{song.title}</h2>
            <div style={{ 
                maxWidth: "1300px",
                marginBottom: "150px", 
                marginTop: "30px" 
            }}>
                <FileFetcher songTitle={song}/>
            </div>

        </>
    );
}

function FileFetcher( {songTitle}: {songTitle: SheetArchiveTitle}) {

    const { isPending, isError, data } = useQuery<SheetArchiveFile[]>({
        queryKey: ["FetchSheetArchiveFile", songTitle.url],
        queryFn: fetchFn<SheetArchiveFile[]>(`/api/sheet_archive/song_files?id=${songTitle.id}`),
    })

    if (isPending) {
        return <>Loading...</>;
    }

    if (isError) {
        return <Navigate to="/notearkiv" replace={true} />;
    }

    return <FileTable files={data}/>
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