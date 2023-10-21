import { LoadingButton } from "@mui/lab"
import { Avatar, Link, Skeleton, Stack, TextField, useTheme } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { Comment, NewComment } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import dayjs from "dayjs"
import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { useAuth } from "src/context/Authentication"
import { useUserReference } from "src/context/UserReference"
import { fetchAsync } from "src/utils/fetchAsync"
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { postJson } from "src/utils/postJson"

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
    const queryKey = [entityType, "comments", entityId]
    const queryClient = useQueryClient()

    const onPostSuccess = async () => {
        await queryClient.invalidateQueries(queryKey)
    }

    return (
        <section
            style={{
                maxWidth: "600px",
                ...style
            }}
        >
            <div style={{marginBottom: "30px"}}>
                <CommentSectionFetcher
                    entityId={entityId}
                    entityType={entityType}
                    queryKey={queryKey}
                />
            </div>
            <CommentForm 
                entityType={entityType}
                entityId={entityId}
                onPostSuccess={onPostSuccess}    
            />
        </section>
    )
}

function CommentSectionFetcher({
    entityType,
    entityId,
    queryKey,
}: {
    entityType: CommentEntityType,
    entityId: number,
    queryKey: any[]
}) {

    const url = `/api/${entityType}/${entityId}/comments`
    const { isLoading, isError, data, error } = useQuery<Comment[]>(queryKey, () => fetchAsync<Comment[]>(url))

    if(isLoading) {
        return <CommentSectionSkeleton length={4}/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <CommentSection comments={data} />
    )
    
}

function CommentSectionSkeleton( {length}: {length: number}) {
    return (
        <>
            {Array(length).fill(1).map((_, i) => (
                <CommentItemSkeleton key={i}/>
            ))}
        </>
    )
}

function CommentItemSkeleton() { 

    return (
        <Stack
            direction="row"
            spacing={2}
            marginBottom="15px"
        >
            <UserAvatarSkeleton style={{marginTop: "5px"}}/>
            <div 
                style={{ 
                    width: "100%",
                }}>
                <Skeleton 
                    variant="rounded"
                    width="100%"
                    height="70px"
                    style={{
                        borderRadius: "10px",
                    }}
                />
                <Skeleton 
                    variant="text"
                    style={{
                        maxWidth: "100px",
                        fontSize: "small"
                    }}
                />
            </div>
        </Stack>
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
            <UserAvatar 
                userId={comment.createdBy}
                style={{
                    marginTop: "5px"
                }}
            />
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
                        <UserFullName userId={comment.createdBy}/>
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
                    {dayjs(comment.createdAt).utc(true).fromNow()}
                </div>
            </div>
        </Stack>
    )
}

function UserAvatar({
    userId,
    style
}: {
    userId: number,
    style?: React.CSSProperties
}) {

    const {isError, isLoading, userReference} = useUserReference()

    if(isLoading) {
        return <UserAvatarSkeleton style={style}/>
    }

    const user = userReference[userId]
    if(isError || !user) {
        return <Avatar style={style}/>
    }

    return (
        <Avatar 
            style={{
                height: "40px",
                width: "40px",
                margin: 0,
                padding: 0,
                ...style
            }}
        >
                {user.initials}
        </Avatar>
    )
}

function UserAvatarSkeleton( {style}: {style?: React.CSSProperties}) {
    return (
        <Skeleton 
            variant="circular"
            style={{
                height: "40px",
                width: "44px",      // I have no idea why, but width needs to be this value in order to not cause layout shift
                margin: 0,
                padding: 0,
                ...style
            }}
        />
    )
}


function UserFullName({
    userId,
    style
}: {
    userId: number,
    style?: React.CSSProperties
}) {

    const {isError, isLoading, userReference} = useUserReference()

    if(isLoading) {
        return (
            <Skeleton 
                variant="text"
                style={{
                    width: "150px",
                    margin: 0,
                    padding: 0,
                    ...style
                }}
            />
        )
    }

    const user = userReference[userId]
    if(isError || !user) {
        return <b>[Ukjent]</b>
    }

    return (
        <Link
            component={RouterLink}
            to={`/medlem/${userId}`}
            style={{
                wordWrap: "break-word",
                fontSize: "inherit",
                color: "inherit",
                textDecorationColor: "inherit",
                ...style
            }}
            underline="hover"
        >
            <b>{user.fullName}</b>
        </Link>
    )
}

function CommentForm({
    entityType,
    entityId,
    onPostSuccess
}: {
    entityType: CommentEntityType,
    entityId: number,
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
}) {
    const user = useAuth().user!
    const [value, setValue] = useState<NewComment>({ comment: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => { 
        e.preventDefault()
        setIsSubmitting(true)

        const newValue: NewComment = {
            comment: value.comment.trim()
        }

        const response = await postJson(`/api/${entityType}/${entityId}/comments/new`, newValue, { alertOnFailure: true })

        if (response && response.ok) {
            onPostSuccess && await onPostSuccess(response)
            setValue({ comment: "" })
        }

        setIsSubmitting(false)
    }

    const disabled = isNullOrWhitespace(value.comment)

    return (
        <form onSubmit={onSubmit}>
            <Stack 
                direction="row"
                spacing={2}
            >
                <UserAvatar
                    userId={user.id}
                />
                <div 
                    style={{
                        width: "100%"
                    }}>
                    <TextField 
                        type="text"
                        label="Skriv en kommentar..."
                        required
                        fullWidth
                        multiline
                        autoComplete="off"
                        value={value.comment}
                        onChange={(e) => setValue({ comment: e.target.value })}
                        minRows={2}
                        disabled={isSubmitting}
                        sx={{mb: 4}}
                    />
                    <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        variant="contained"
                        loadingPosition="end"
                        endIcon={<SendIcon />}
                        disabled={disabled}
                        style={{
                            minWidth: "120px"
                        }}
                    >
                        Kommenter
                    </LoadingButton>
                </div>
            </Stack>
        </form>
    )
}