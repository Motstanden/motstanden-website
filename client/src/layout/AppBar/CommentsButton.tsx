import ForumIcon from '@mui/icons-material/Forum';
import { Badge, Divider, IconButton } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Count } from 'common/interfaces';
import { Link as RouterLink } from "react-router-dom";
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { LatestCommentsList } from 'src/routes/comments/components/LatestCommentsList';
import { fetchFn } from 'src/utils/fetchAsync';
import { useIsMobileScreen } from '../useAppSizes';
import { ToolbarButtonIcon, toolbarButtonSx } from './ToolbarButton';

export function CommentsButton() {
    const isMobile = useIsMobileScreen()
    
    const queryClient = useQueryClient()
    const queryKey = ["comments", "unread", "count"]
    const { data } = useQuery<Count>({
        queryKey: queryKey,
        queryFn: fetchFn(`/api/comments/unread/count`),
        refetchOnWindowFocus: "always",
        refetchOnMount: "always",
        refetchOnReconnect: "always",
    })
    const unreadComments = data?.count ?? 0

    const onClick = async () => { 
        await fetch(`/api/comments/unread/count/reset`, { method: "POST" })
        await queryClient.invalidateQueries({queryKey: queryKey})
    }

    return isMobile 
        ? <MobileCommentsButton badgeContent={unreadComments} onClick={onClick}/> 
        : <DesktopCommentsButton badgeContent={unreadComments} onClick={onClick}/>
}

function MobileCommentsButton({
    badgeContent,
    onClick
}: {
    badgeContent?: number,
    onClick?: () => void
}) { 
    return (
        <IconButton
            sx={toolbarButtonSx}
            component={RouterLink}
            to="/kommentarer"
            onClick={onClick}
        >
            <CommentsButtonIcon badgeContent={badgeContent} />
        </IconButton>
    )
}

function DesktopCommentsButton({
    badgeContent,
    onClick
}: {
    badgeContent?: number,
    onClick?: () => void
}) { 
    return(
        <IconPopupMenu 
            icon={<CommentsButtonIcon badgeContent={badgeContent} />}
            sx={toolbarButtonSx}
            onClick={onClick}
            menuSx={{
                marginTop: "5px",
                marginBottom: "-30px",
                minHeight: "100vh",
                width: "MIN(550px, 65vw)",

            }}
            transformOrigin={{horizontal: 'left', vertical: 'top'}}
            elevation={16}
            >
            <div 
                style={{
                    paddingInline: "15px",
                    paddingTop: "10px",
                    paddingBottom: "50px",
                }}>
                <h3 style={{ margin: 0 }}>Kommentarer</h3>
                <Divider sx={{mt: 1.5, mb: 2}}/>
                <LatestCommentsList/>
            </div>
        </IconPopupMenu>
    )
}

function CommentsButtonIcon({badgeContent}: {badgeContent?: number }) {
    return (
        <Badge 
            badgeContent={badgeContent}
            max={9}
            color='error'
            sx={{
                ".MuiBadge-badge": {
                    top: "5px",
                    right: "5px",
                    fontSize: "9pt",
                    minWidth: "0px",
                    minHeight: "0px",
                    fontWeight: "600"
                },
            }}
        >
            <ToolbarButtonIcon tooltip='Kommentarer'>
                <ForumIcon 
                    fontSize="small"
                    sx={{
                        color: "primary.contrastText",
                    }}
                    />
            </ToolbarButtonIcon>
        </Badge>
    )
}