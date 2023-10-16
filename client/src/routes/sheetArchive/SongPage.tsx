import EditIcon from '@mui/icons-material/Edit';
import {
    Checkbox,
    FormControlLabel, Grid, IconButton,
    Link,
    Paper,
    Skeleton,
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
import { useEffect, useState } from 'react';
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';
import { Form } from 'src/components/form/Form';
import { useAuth } from "src/context/Authentication";
import { useTitle } from "../../hooks/useTitle";
import { useQueryClient } from '@tanstack/react-query';
import { sheetArchiveContextQueryKey } from './Context';

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
                    {items.map( song => <TitleTableRow key={song.id} song={song} canEdit={isAdmin} /> )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

type TableRowState = "read" | "edit" | "changing"

function TitleTableRow( {song, canEdit }: {song: SheetArchiveTitle, canEdit: boolean }) {
    
    const [mode, setMode] = useState<TableRowState>("read")
    const queryClient = useQueryClient()

    const onEditClick = () => setMode("edit")

    const onAbortEditClick = () => setMode("read")

    const onPostSuccess = async () => {
        setMode("changing")
        await queryClient.invalidateQueries(sheetArchiveContextQueryKey)
        setMode("read")
    }

    if(mode === "edit") 
        return <EditRow 
            song={song} 
            onAbort={onAbortEditClick} 
            onSuccess={onPostSuccess}/>

    if(mode === "changing")
        return <SkeletonRow canEdit={canEdit}/>

    return <ReadOnlyRow song={song} canEdit={canEdit} onEditClick={onEditClick}/>
}

function ReadOnlyRow( {song, canEdit, onEditClick}: {song: SheetArchiveTitle, canEdit: boolean, onEditClick: VoidFunction} ){
    return (
        <TableRow sx={rowStyle}>
            <TableCell >
                <Link
                    component={RouterLink}
                    to={song.url}
                    underline="hover"
                    sx={linkStyle}>
                    {song.title}
                </Link>
            </TableCell>
            <TableCell >{song.extraInfo}</TableCell>
            {canEdit && 
                <TableCell align="right" width="1px" size="small">
                    <IconButton onClick={_ => onEditClick()} >
                        <EditIcon fontSize='small'/>
                    </IconButton>
                </TableCell>}
        </TableRow>  
    )
}

function SkeletonRow( {canEdit}: {canEdit: boolean}) {

    return (
        <TableRow sx={rowStyle}>
            <TableCell>
                <Skeleton style={{maxWidth: "130px"}}/>
            </TableCell>
            <TableCell>
                <Skeleton style={{maxWidth: "85px"}}/>
            </TableCell>
            {canEdit && 
                <TableCell align="right" size="small">
                    <Skeleton style={{
                        // This is bad css. We do it like this because the time is 0400 and thus idgaf
                        width: "25px",  
                        height: "40px", 
                        borderRadius: "50%",
                        marginLeft: "5px"
                        }} />
                </TableCell>
            }
        </TableRow>
    )
}

function EditRow( {
    song, 
    onAbort, 
    onSuccess
}: {
    song: SheetArchiveTitle, 
    onAbort: VoidFunction, 
    onSuccess: ((res: Response) => Promise<void>) | ((res: Response) => void) 
} ) {
    const [newSong, setNewSong] = useState(song)
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const getSubmitData = (): SheetArchiveTitle => ({
        ...newSong, 
        extraInfo: newSong.extraInfo.trim().replace(/\s+/g, ' '), 
        title: newSong.title.trim().replace(/\s+/g, ' ')
    })

    const submitData = getSubmitData()
    const isDisabled = song.title.trim() === submitData.title.trim() && 
                       song.extraInfo.trim() === submitData.extraInfo.trim() &&
                       song.isRepertoire === submitData.isRepertoire  

    return (
        <TableRow sx={rowStyle}>
            <TableCell colSpan={3} style={{
                paddingTop: isSmallScreen ? "50px" : "40px",
                paddingBottom: isSmallScreen ? "30px" : "35px"
                }}>
                <Form 
                    value={getSubmitData} 
                    postUrl={`/api/sheet-archive/titles/update`}
                    onAbortClick={ _ => onAbort()}
                    onPostSuccess={onSuccess}
                    disabled={isDisabled}
                    noDivider={true}
                    noPadding={true}>
                    <Grid 
                        container 
                        columnSpacing={3} 
                        rowSpacing={4} 
                        alignItems="center"
                        style={{marginBottom: isSmallScreen ? "30px" : "35px"}}>
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