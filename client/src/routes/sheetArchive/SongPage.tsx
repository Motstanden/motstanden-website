import EditIcon from '@mui/icons-material/Edit';
import {
    Checkbox,
    FormControlLabel, Grid, IconButton,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Theme,
    useMediaQuery
} from "@mui/material";
import { UserGroup } from "common/enums";
import { SheetArchiveTitle } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import { useState } from 'react';
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { Form } from 'src/components/form/Form';
import { useAuth } from "src/context/Authentication";
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
    const user = useAuth().user
    const isAdmin = !!user && hasGroupAccess(user, UserGroup.Administrator)
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>Sang</TableCell>
                        <TableCell>Laget av</TableCell>
                        {/* TODO */}
                        {/* <TableCell>Kategori</TableCell>  */}
                        {isAdmin && <TableCell/>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map( song => <TitleTableRow key={song.url} song={song} canEdit={isAdmin} /> )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function TitleTableRow( {song, canEdit }: {song: SheetArchiveTitle, canEdit: boolean }) {
    
    const [isEditing, setIsEditing] = useState(false)

    if(isEditing) 
        return <EditFileRow song={song} onAbort={() => setIsEditing(false)} onSuccess={() => setIsEditing(false)}/>

    return <ReadOnlyFileRow song={song} canEdit={canEdit} onEditClick={ () => setIsEditing(true)}/>

}

function ReadOnlyFileRow( {song, canEdit, onEditClick}: {song: SheetArchiveTitle, canEdit: boolean, onEditClick: VoidFunction} ){
    return (
        <TableRow sx={rowStyle}>
            <TableCell>
                <Link
                    component={RouterLink}
                    to={song.url}
                    underline="hover"
                    sx={linkStyle}>
                    {song.title}
                </Link>
            </TableCell>
            <TableCell >{song.extraInfo}</TableCell>
            {/* <MenuButton song={song}/> */}
            {canEdit && 
                <TableCell align="right" size="small" width="1px">
                    <IconButton onClick={_ => onEditClick()} >
                        <EditIcon fontSize='small'/>
                    </IconButton>
                </TableCell>}
        </TableRow>  
    )
}

function EditFileRow( {song, onAbort, onSuccess}: {song: SheetArchiveTitle, onAbort: VoidFunction, onSuccess: VoidFunction} ) {
    const [newSong, setNewSong] = useState(song)
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <TableRow sx={rowStyle}>
            <TableCell colSpan={3} style={{paddingTop: "50px"}}>
                <Form value={newSong} postUrl="todo" onAbortClick={ _ => onAbort()} onPostSuccess={_ => onSuccess()}>
                    <Grid container columnSpacing={3} rowSpacing={4} alignItems="center">
                        <Grid item xs={12} sm={4.5} md={5.1} >
                            <TextField 
                                label="Tittel"
                                name="title"
                                required
                                fullWidth
                                autoComplete="off"
                                value={newSong.title}
                                onChange={(e) => setNewSong( oldVal => ({...oldVal, title: e.target.value}))}
                                />
                        </Grid>
                        <Grid item xs={12} sm={4.5} md={5.1}>
                            <TextField 
                                label="Laget av"
                                name="extraInfo"
                                autoComplete='0ff'
                                fullWidth
                                value={newSong.extraInfo}
                                onChange={(e) => setNewSong( oldVal => ({...oldVal, extraInfo: e.target.value}))}
                                />
                        </Grid>
                        <Grid item xs={12} sm={3} md={1.8} style={{textAlign: isSmallScreen ? "center" : "right"}}>
                            <FormControlLabel 
                                label="Repertoar" 
                                control={
                                    <Checkbox 
                                        checked={newSong.isRepertoire} 
                                        onChange={ _ => setNewSong(oldVal => ({...oldVal, isRepertoire: !oldVal.isRepertoire}))} 
                                    />
                                }
                                />
                        </Grid>
                    </Grid>
                </Form>
            </TableCell>
        </TableRow>
    )
}