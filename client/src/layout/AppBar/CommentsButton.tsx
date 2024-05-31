import ForumIcon from '@mui/icons-material/Forum';
import { Divider, Link, Skeleton, Stack } from '@mui/material';
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
import { ToolbarButtonIcon, toolbarButtonSx } from './ToolbarButton';

export function CommentsButton() {
    return(
        <IconPopupMenu 
            icon={<CommentsButtonIcon />}
            sx={toolbarButtonSx}
            menuSx={{
                marginTop: "5px",
                marginBottom: "-30px",
                minHeight: "100vh",
                minWidth: "300px",
                maxWidth: "500px",

            }}
            transformOrigin={{horizontal: 'left', vertical: 'top'}}
            elevation={16}
            >
            <div 
                style={{
                    paddingInline: "18px",
                    paddingTop: "10px",
                    paddingBottom: "50px",
                }}>
                <h3 style={{ margin: 0 }}>Kommentarer</h3>
                <Divider sx={{mt: 1.5, mb: 2}}/>
                <CommentsLoader />
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

function CommentsLoader() {

    const { isPending, isError, data, error } = useQuery<EntityComment[]>({
        queryKey: ["comments", "newest"],
        queryFn: fetchFn("/api/comments/all?limit=12")
    })

    if(isPending)
        return <CommentsSkeleton length={12}/>

    if(isError)
        return <>{error}</>

    return <CommentsRenderer comments={data} />
}

function CommentsRenderer({ comments } : { comments: EntityComment[]}) {

    const buildUrl = (comment: EntityComment): string  => {
        switch(comment.type) {
            case CommentEntityType.Event:
                return `/arrangement/${comment.entityId}#comment-${comment.id}`
            case CommentEntityType.Poll:    
                return `/avstemninger/${comment.entityId}#comment-${comment.id}`   
            case CommentEntityType.SongLyric:
                return `/studenttraller/${comment.entityId}#comment-${comment.id}`
            case CommentEntityType.WallPost:
                return `/vegg/${comment.entityId}#comment-${comment.id}`
            default:
                return ``
        }
    }

    if(comments.length <= 0)
        return <span style={{opacity: 0.75 }}>Ingen nye kommentarer...</span>

    return (
        <>
        {comments.map(comment => (
            <div 
                key={`${comment.entityId}-${comment.id}`}
                style={{
                    marginBottom: "15px",
                }}
            >
                <Stack 
                    direction="row"
                    spacing={2}
                >
                    <UserAvatar
                        userId={comment.createdBy}
                        style={{
                            marginTop: "5px"
                        }}
                    />
                    <div style={{
                        overflow: "hidden",
                    }}>
                        <div>
                            <UserFullName 
                                userId={comment.createdBy} 
                                style={{
                                    opacity: "0.75",
                                    fontSize: "small"
                                }}
                                />
                        </div>
                        <div style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                        }}>
                            <Link
                                color="secondary"
                                underline="hover"
                                fontSize="large"
                                component={RouterLink}
                                to={buildUrl(comment) ?? "#"}
                            >
                                {comment.comment}
                            </Link>
                        </div>
                        <div
                            style={{
                                fontSize: "small",
                                opacity: "0.6"
                            }}
                        >
                            {dayjs.utc(comment.createdAt).locale(relativeTimeShortFormat).fromNow()}
                        </div>
                    </div>
                </Stack>
            </div>
        ))}
        </>
    )
}

function CommentsSkeleton({length}: {length: number}) {
    return (
        <div>
            {Array(length).fill(1).map((_, i) => (
                <div
                    key={i}
                    style={{
                        marginBottom: "15px",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                    >
                        <UserAvatarSkeleton 
                            style={{
                                marginTop: "5px"
                            }}
                        />
                        <div style={{width: "80%"}}>
                            <div>
                                <Skeleton 
                                    variant="text" 
                                    style={{ 
                                        fontSize: "small",
                                        maxWidth: "100px",
                                    }} />
                            </div>
                            <div>
                                <Skeleton 
                                    variant="text" 
                                    style={{ 
                                        fontSize: "larger",
                                    }} />
                            </div>
                            <div>
                                <Skeleton
                                    variant="text"
                                    style={{
                                        fontSize: "small",
                                        maxWidth: "80px"
                                    }}
                                />
                            </div>
                        </div>
                    </Stack>
                </div>
            ))}
        </div>
    )
}