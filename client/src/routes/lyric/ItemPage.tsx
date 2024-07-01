import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Divider, Theme, useMediaQuery, useTheme } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { CommentEntityType } from 'common/enums'
import { SongLyric } from 'common/interfaces'
import { useNavigate } from "react-router-dom"
import { AuthorInfo } from 'src/components/AuthorInfo'
import { CommentSection } from 'src/components/CommentSection'
import { MarkDownRenderer } from 'src/components/MarkDownEditor'
import { DeleteMenuItem } from 'src/components/menu/DeleteMenuItem'
import { EditMenuItem } from 'src/components/menu/EditMenuItem'
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu'
import { usePotentialUser } from 'src/context/Authentication'
import { httpDelete } from 'src/utils/postJson'
import { useTitle } from "../../hooks/useTitle"
import { lyricContextQueryKey, useLyricItemContext } from './Context'

export function LyricItemPage() {
    const [_allLyrics, lyric] = useLyricItemContext()
    const { isLoggedIn } = usePotentialUser()
    useTitle(lyric.title);

    const theme = useTheme();

    return (
        <>
            <div style={{
                color: theme.palette.text.secondary,
            }}>
                <TitleHeader lyric={lyric} />
                <AuthorInfo
                    createdByUserId={lyric.createdBy}
                    createdAt={lyric.createdAt}
                    updatedByUserId={lyric.updatedBy}
                    updatedAt={lyric.updatedAt}
                    style={{
                        fontSize: "small",
                    }}/>
                <div style={{
                    fontSize: "1.2em",
                    lineHeight: "1.6em",
                }}>
                    <MarkDownRenderer value={lyric.content} />
                </div>
                {isLoggedIn && (
                    <div>
                        <Divider sx={{ my: 6 }} />
                        <CommentSection
                            entityId={lyric.id}
                            entityType={CommentEntityType.SongLyric}
                            />
                    </div>
                )}
            </div>
        </>
    );
}


function TitleHeader( {lyric}: {lyric: SongLyric} ) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    const {isLoggedIn, isAdmin, user} = usePotentialUser();
    const canDelete = isAdmin || (isLoggedIn && user.id === lyric.createdBy)

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const onEditClick = () => {
        navigate("rediger")
    }

    const onDeleteClick = async () => {
        const response = await httpDelete(`/api/lyrics/${lyric.id}`, {
            alertOnFailure: true,
            confirmText: "Vil du permanent slette denne trallen?"
        }
    )
        if(response?.ok) {
            await queryClient.invalidateQueries({queryKey: lyricContextQueryKey})
            navigate("..", { replace: true })
        }
    }

    if(!isLoggedIn)
        return (
            <h1 
                style={{
                    marginBottom: "0px",
                    overflowWrap: "break-word",
                }} 
            >
                {lyric.title}
            </h1>
    )

    return (
        <div 
            style={{
                display: "grid",
                gridTemplateColumns: isSmallScreen ? "auto min-content" : "auto min-content 1fr",
                gridTemplateRows: "auto",
                wordBreak: "break-all",
                alignItems: "flex-start",
                marginTop: "20px",
                marginBottom: "0px"
            }}
        >
            <h1 style={{margin: "0px"}} >
                {lyric.title}
            </h1>
            <IconPopupMenu 
                icon={<MoreHorizIcon/>}
                ariaLabel='Trallmeny'
                style={{
                    marginTop: "5px",
                    marginLeft: isSmallScreen ? "0px" : "20px"
                }}
            >
                <EditMenuItem onClick={onEditClick} divider={canDelete} />
                {canDelete && <DeleteMenuItem onClick={onDeleteClick} />}
            </IconPopupMenu>
        </div>
    )
}