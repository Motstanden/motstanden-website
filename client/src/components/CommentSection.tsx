import { Avatar, Stack, useTheme } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { Comment } from "common/interfaces"
import dayjs from "dayjs"
import { fetchAsync } from "src/utils/fetchAsync"


export {
    CommentSectionContainer as CommentSection
}

function CommentSectionContainer({
    entityType,
    entityId,
    style,
}: {
    entityType: CommentEntityType,
    entityId: number
    style?: React.CSSProperties
}){
    return (
        <section
            style={{
                maxWidth: "600px",
                ...style
            }}
        >
            <CommentSectionFetcher
                entityId={entityId}
                entityType={entityType}
            />
        </section>
    )
}

function CommentSectionFetcher({
    entityType,
    entityId,
}: {
    entityType: CommentEntityType,
    entityId: number
}) {

    const queryKey = [entityType, "comments", entityId]
    const url = `/api/${entityType}/${entityId}/comments`
    const { isLoading, isError, data, error } = useQuery<Comment[]>(queryKey, () => fetchAsync<Comment[]>(url))

    if(isLoading) {
        return <CommentSectionSkeleton/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <CommentSection comments={data} />
    )
    
}

function CommentSectionSkeleton() {
    return (
        <></> // TODO: Implement
    )
}

function CommentSection( {comments}: {comments: Comment[]}) {
    return (
        <>
            {comments.map(comment => (
                <CommentItem 
                    key={comment.id}
                    comment={comment}
                    style={{
                        marginBottom: "15px",
                    }}
                />
            ))}
        </>
    )
}

function CommentItem( {
    comment,
    style
}: {
    comment: Comment,
    style?: React.CSSProperties
}) {
    const theme = useTheme()
    return (
        <Stack 
            direction="row"
            spacing={2}
            style={style}
        >
            <Avatar 
                style={{
                    marginTop: "5px"
                }}
            >
                {comment.createdBy}
            </Avatar>
            <div
                style={{
                    width: "100%"
                }}
            >
                <div
                    style={{
                        backgroundColor: theme.palette.divider,
                        padding: "12px",
                        borderRadius: "10px",
                    }}
                >
                    <div>
                        <b>{comment.createdBy}</b>
                    </div>
                    <div>
                        {comment.comment}
                    </div>
                </div>
                <div
                    style={{
                        marginLeft: "5px",
                        fontSize: "small",
                        opacity: "0.6"
                    }}
                >
                    {dayjs(comment.createdAt).fromNow()}
                </div>
            </div>
        </Stack>
    )
}