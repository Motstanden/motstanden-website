import ForumIcon from '@mui/icons-material/Forum';
import { Divider, IconButton, Link, Skeleton, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { CommentEntityType } from 'common/enums';
import { EntityComment } from 'common/interfaces';
import dayjs from 'dayjs';
import { Link as RouterLink } from "react-router-dom";
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { UserAvatar, UserAvatarSkeleton } from 'src/components/user/UserAvatar';
import { UserFullName } from 'src/components/user/UserFullName';
import { relativeTimeShortFormat } from 'src/context/Locale';
import { fetchFn } from 'src/utils/fetchAsync';
import { useIsMobileScreen } from '../useAppSizes';
import { ToolbarButtonIcon, toolbarButtonSx } from './ToolbarButton';
import { LatestCommentsList } from 'src/routes/comments/components/LatestCommentsList';

export function CommentsButton() {
    const isMobile = useIsMobileScreen()
    return isMobile 
        ? <MobileCommentsButton/> 
        : <DesktopCommentsButton/>
}

function MobileCommentsButton() { 
    return (
        <IconButton
            sx={toolbarButtonSx}
            component={RouterLink}
            to="/kommentarer"
        >
            <CommentsButtonIcon />
        </IconButton>
    )
}

function DesktopCommentsButton() {
    return(
        <IconPopupMenu 
            icon={<CommentsButtonIcon />}
            sx={toolbarButtonSx}
            menuSx={{
                marginTop: "5px",
                marginBottom: "-30px",
                minHeight: "100vh",
                minWidth: "300px",
                maxWidth: "MIN(550px, 65vw)",

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

function CommentsButtonIcon() {
    return (
        <ToolbarButtonIcon tooltip='Kommentarer'>
            <ForumIcon 
                fontSize="small"
                sx={{
                    color: "primary.contrastText",
                }}
                />
        </ToolbarButtonIcon>
    )
}