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
    Link as RouterLink,
    Navigate,
    useNavigate,
    useOutletContext,
    useParams
} from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { useTitle } from "../../hooks/useTitle";
import { fetchAsync } from "../../utils/fetchAsync";

export default function InstrumentPage() {
    const params = useParams();
    const navigate = useNavigate()
    const songData = useOutletContext<SheetArchiveTitle[]>();
    const song = songData.find(item => item.url === params.title)
    useTitle(song?.title);
    
    if(!song)
        return navigate("/notearkiv")

    const { isLoading, isError, data } = useQuery<SheetArchiveFile[]>(["FetchSheetArchiveFile", song.url], () => fetchAsync<SheetArchiveFile[]>(`/api/sheet_archive/song_files?id=${song.id}`))

    if (isLoading) {
        return <>Loading...</>;
    }

    if (isError) {
        return <Navigate to="/notearkiv" replace={true} />;
    }

    return (
        <>
            <h3>{song!.title}</h3>
            <div style={{ marginBottom: "150px", marginTop: "30px" }}>
                <FileTable files={data} />
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