import EditIcon from '@mui/icons-material/Edit'
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
} from "@mui/material"
import { useQueryClient } from '@tanstack/react-query'
import { NewSheetArchiveTitle, SheetArchiveTitle } from "common/interfaces"
import { useState } from 'react'
import { Link as RouterLink } from "react-router-dom"
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle'
import { Form } from 'src/components/form/Form'
import { useAuthenticatedUser } from "src/context/Authentication"
import { useTitle } from "../../hooks/useTitle"
import { sheetArchiveContextQueryKey, useSheetArchiveContext } from './Context'

export default function SongPage({ mode }: { mode?: "repertoire" }) {

    const isRepertoire: boolean = mode === "repertoire"

    useTitle(isRepertoire ? "Repertoar" : "Alle noter");


    const { isPending, sheetArchive: allSheets } = useSheetArchiveContext()

    const sheetArchive = isRepertoire 
        ? allSheets.filter(item => !!item.isRepertoire)
        : allSheets 

    return (
        <>
            <div style={{
                maxWidth: "1300px"
            }}>
                <TitleTable 
                    items={sheetArchive} 
                    isLoading={isPending}
                    skeletonLength={isRepertoire ? 14 : 40}
                />
            </div>
        </>
    )
}

function TitleTable( { items, isLoading, skeletonLength }: { items: SheetArchiveTitle[], isLoading: boolean, skeletonLength: number}) {
    const { isAdmin } = useAuthenticatedUser()
    
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

                    {isLoading && (
                        <SkeletonRows length={skeletonLength} canEdit={isAdmin}/>
                    )}

                    {!isLoading && items.map( song => (
                        <TitleTableRow 
                            key={song.id} 
                            song={song} 
                            canEdit={isAdmin} /> 
                    ))}

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
        await queryClient.invalidateQueries({queryKey: sheetArchiveContextQueryKey})
        setMode("read")
    }

    if(mode === "edit") 
        return <EditRow
            songId={song.id} 
            initialValue={song} 
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

function SkeletonRows({length, canEdit}: {length: number, canEdit: boolean}) { 
    return Array(length).fill(1).map( (_, i) => (
        <SkeletonRow key={i} canEdit={canEdit}/>
    ))
}

function SkeletonRow( {canEdit}: {canEdit: boolean}) {

    return (
        <TableRow sx={rowStyle}>
            <TableCell>
                <Skeleton style={{width: "200px"}}/>
            </TableCell>
            <TableCell>
                <Skeleton style={{width: "85px"}}/>
            </TableCell>
            {canEdit && 
                <TableCell align="right" width="1px" size="small">
                    <Skeleton 
                        style={{
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
    songId,
    initialValue, 
    onAbort, 
    onSuccess
}: {
    songId: number,
    initialValue: NewSheetArchiveTitle, 
    onAbort: VoidFunction, 
    onSuccess: ((res: Response) => Promise<void>) | ((res: Response) => void) 
} ) {
    const [newSong, setNewSong] = useState(initialValue)
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const getSubmitData = (): NewSheetArchiveTitle => ({
        ...newSong, 
        extraInfo: newSong.extraInfo.trim().replace(/\s+/g, ' '), 
        title: newSong.title.trim().replace(/\s+/g, ' ')
    })

    const submitData = getSubmitData()
    const isDisabled = initialValue.title.trim() === submitData.title.trim() && 
                       initialValue.extraInfo.trim() === submitData.extraInfo.trim() &&
                       initialValue.isRepertoire === submitData.isRepertoire  

    return (
        <TableRow sx={rowStyle}>
            <TableCell colSpan={3} style={{
                paddingTop: isSmallScreen ? "50px" : "40px",
                paddingBottom: isSmallScreen ? "30px" : "35px"
                }}>
                <Form 
                    value={getSubmitData} 
                    url={`/api/sheet-archive/titles/${songId}/update`}
                    onAbortClick={ _ => onAbort()}
                    onSuccess={onSuccess}
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