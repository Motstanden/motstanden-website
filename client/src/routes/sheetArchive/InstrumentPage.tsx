import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useQuery } from '@tanstack/react-query';
import {
    Link as RouterLink,
    Navigate,
    useOutletContext,
    useParams
} from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { useTitle } from "../../hooks/useTitle";
import { fetchAsync } from "../../utils/fetchAsync";
import { ISongFile, ISongInfo } from './Components';

export default function InstrumentPage() {
    const params = useParams();
    const songData = useOutletContext<ISongInfo[]>();
    const song = songData.find(item => item.url === params.title);

    useTitle(song?.title);

    const { isLoading, isError, data } = useQuery<ISongFile[]>(["FetchSheetArchiveFile", song!.url], () => {
        if (song) {
            return fetchAsync<ISongFile[]>(`/api/sheet_archive/song_files?titleId=${song.titleId}`);
        }
        else {
            throw new Error("Title is null");
        }
    }, {
        retry: false
    });

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

function FileTable({ files }: { files: ISongFile[]; }) {
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