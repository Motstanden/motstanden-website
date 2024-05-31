import { Link, Skeleton, Stack } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { EntityComment } from "common/interfaces"
import dayjs from 'dayjs'
import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { UserAvatar, UserAvatarSkeleton } from "src/components/user/UserAvatar"
import { UserFullName } from "src/components/user/UserFullName"
import { relativeTimeShortFormat } from 'src/context/Locale'
import { fetchFn } from "src/utils/fetchAsync"


export function LatestCommentsList() {
 
    const length = 15

    const { isPending, isError, data, error } = useQuery<EntityComment[]>({
        queryKey: ["comments", "latest"],
        queryFn: fetchFn(`/api/comments/all?limit=${length}`)
    })

    if(isPending)
        return <CommentListSkeleton length={length}/>

    if(isError)
        return <>{error}</>

    return <CommentsList comments={data} />
}

function buildCommentUrl(comment: EntityComment): string { 
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

function CommentsList({ comments } : { comments: EntityComment[]}) {

    if(comments.length <= 0)
        return <span style={{opacity: 0.75 }}>Ingen nye kommentarer...</span>

    return (
        <>
            {comments.map(comment => (
                <CommentItem 
                    key={`${comment.entityId}-${comment.id}`}
                    comment={comment}
                    style={{
                        marginBottom: "15px",
                    }}
                />
            ))}
        </>
    )
}

function CommentItem({
    comment,
    style,
}: {
    comment: EntityComment,
    style?: React.CSSProperties
}) {
    return (
        <div style={style}>
            <Stack
                direction="row"
                spacing={2}
            >
                <UserAvatar
                    userId={comment.createdBy}
                    style={{
                        marginTop: "5px"
                    }} />
                <div style={{
                    overflow: "hidden",
                }}>
                    <div>
                        <UserFullName
                            userId={comment.createdBy}
                            style={{
                                opacity: "0.75",
                                fontSize: "small"
                            }} />
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
                            to={buildCommentUrl(comment) ?? "#"}
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
    )
}

function CommentListSkeleton({length}: {length: number}) {
    return (
        <div>
            {Array(length).fill(1).map((_, i) => (
                <CommentItemSkeleton 
                    key={i}
                    style={{
                        marginBottom: "15px",
                    }}
                />
            ))}
        </div>
    )
}
function CommentItemSkeleton( {style}: {style?: React.CSSProperties}) {
    return (
        <div style={style}>
            <Stack
                direction="row"
                spacing={2}
            >
                <UserAvatarSkeleton
                    style={{
                        marginTop: "5px"
                    }} />
                <div style={{ width: "80%" }}>
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
                            }} />
                    </div>
                </div>
            </Stack>
        </div>
    )
}