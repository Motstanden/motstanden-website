import {
    Link,
    Paper, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { SheetArchiveTitle } from "common/interfaces";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { useTitle } from "../../hooks/useTitle";

export default function SongPage({ mode }: { mode?: "repertoire" }) {

    const isRepertoire: boolean = mode === "repertoire"

    useTitle(isRepertoire ? "Repertoar" : "Alle noter");

    let data = useOutletContext<SheetArchiveTitle[]>()
    if (isRepertoire)
        data = data.filter(item => !!item.isRepertoire)

        return (
        <>
            <h1>Notearkiv</h1>
            <TitleTable items={data}/>
        </>
    )
}

function TitleTable( { items }: { items: SheetArchiveTitle[]}) {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>Sang</TableCell>
                        <TableCell>Laget av</TableCell>
                        {/* TODO */}
                        {/* <TableCell>Kategori</TableCell>  */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map( song => (
                        <TableRow key={song.url} sx={rowStyle}>
                            <TableCell>
                                <Link
                                    component={RouterLink}
                                    to={song.url}
                                    underline="hover"
                                    sx={linkStyle}>
                                    {song.title}
                                </Link>
                            </TableCell>
                            <TableCell>{song.extraInfo}</TableCell>
                            {/* <TableCell>-</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
