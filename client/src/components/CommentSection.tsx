import SendIcon from '@mui/icons-material/Send'
import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { Link, Skeleton, Stack, TextField, TextFieldProps, Theme, useMediaQuery, useTheme } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { Comment, NewComment } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import dayjs from "dayjs"
import { useLayoutEffect, useState } from "react"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { useAuth } from "src/context/Authentication"
import { useUserReference } from "src/context/UserReference"
import { fetchAsync } from "src/utils/fetchAsync"
import { postJson } from "src/utils/postJson"
import { UserAvatar, UserAvatarSkeleton } from './user/UserAvatar'

export {
    CommentSectionContainer as CommentSection
}

type CommentSectionVariant = "compact" | "normal"

function CommentSectionContainer({
    entityType,
    entityId,
    variant,
    style,
}: {
    entityType: CommentEntityType,
    entityId: number,
    variant?: CommentSectionVariant,
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
                    variant={variant ?? "normal"}
                />
            </div>
            <CommentForm 
                entityType={entityType}
                entityId={entityId}
                variant={variant ?? "normal"}
                onPostSuccess={onPostSuccess}    
            />
        </section>
    )
}

function CommentSectionFetcher({
    entityType,
    entityId,
    queryKey,
    variant,
}: {
    entityType: CommentEntityType,
    entityId: number,
    queryKey: any[],
    variant?: CommentSectionVariant,
}) {

    const url = `/api/${entityType}/${entityId}/comments`
    const { isLoading, isError, data, error } = useQuery<Comment[]>(queryKey, () => fetchAsync<Comment[]>(url))

    if(isLoading) {
        return <CommentSectionSkeleton variant={variant}/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <CommentSection comments={data} variant={variant} />
    )
    
}

export function CommentSectionSkeleton( {
    variant,
}: {
    variant?: CommentSectionVariant,
}) {
    const length = variant === "normal" ? 4 : 2
    return (
        <>
            {Array(length).fill(1).map((_, i) => (
                <CommentItemSkeleton key={i} variant={variant}/>
            ))}
        </>
    )
}

function CommentItemSkeleton( {variant}: {variant?: CommentSectionVariant}) { 

    const commentBubbleStyle: React.CSSProperties = 
        variant === "normal" ? {
            height: "70px",
            borderRadius: "10px",
        } : {
            height: "60px",
            borderRadius: "16px",
        }   

    return (
        <Stack
            direction="row"
            spacing={variant === "normal" ? 2 : 1}
            marginBottom="15px"
        >
            <UserAvatarSkeleton style={{marginTop: "5px"}}/>
            <div 
                style={{ 
                    width: "100%",
                }}>
                <Skeleton 
                    variant="rounded"
                    height="70px"
                    style={{
                        ...commentBubbleStyle
                    }}
                />
                <Skeleton 
                    variant="text"
                    style={{
                        marginLeft: "5px",
                        maxWidth: "100px",
                        fontSize: "small"
                    }}
                />
            </div>
        </Stack>
    )
}

function CommentSection( {
    comments,
    variant
}: {
    comments: Comment[],
    variant?: CommentSectionVariant,
}) {
    const location = useLocation()
    
    useLayoutEffect(() => {
        if(location.hash && location.hash.startsWith("#comment-")) {
            const element = document.getElementById(location.hash.substring(1))
            if(element) {
                // We expect 'instant' to throw build errors: https://github.com/Microsoft/TypeScript/issues/28755
                // @ts-ignore
                window.scrollTo({ top: 0, left: 0, behavior: "instant" })
                
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" })
                }, 600);
            }
        }
    }, [])

    return (
        <>
            {comments.map(comment => (
                <CommentItem 
                    key={comment.id}
                    comment={comment}
                    variant={variant ?? "normal"}
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
    style,
    variant,
}: {
    comment: Comment,
    style?: React.CSSProperties,
    variant?: CommentSectionVariant,
}) {
    const theme = useTheme()

    const commentContainerStyle: React.CSSProperties = 
        variant === "normal" ? {
            width: "100%",
        } : {

        }

    const commentBubbleStyle: React.CSSProperties = 
        variant === "normal" ? {
            padding: "12px" ,
            borderRadius: "10px",
        } : {
            paddingBlock: "7px",
            paddingInline: "14px",
            borderRadius: "16px",
        }

    const userNameStyle: React.CSSProperties = 
        variant === "normal" ? {
            fontSize: "inherit",
        } : {
            fontSize: "small",
        }

    return (
        <div id={`comment-${comment.id}`}>
            <Stack 
                direction="row"
                spacing={variant === "normal" ? 2 : 1 }
                style={style}
            >
                <UserAvatar 
                    userId={comment.createdBy}
                    style={{
                        marginTop: "5px"
                    }}
                />
                <div style={commentContainerStyle}>
                    <div
                        style={{
                            backgroundColor: theme.palette.divider,
                            ...commentBubbleStyle,
                            minWidth: "130px",
                        }}
                    >
                        <div>
                            <UserFullName 
                                userId={comment.createdBy}
                                style={userNameStyle}
                            />
                        </div>
                        <div 
                            style={{
                                whiteSpace: "pre-line"
                            }}>
                            {comment.comment}
                        </div>
                    </div>
                    <div
                        style={{
                            marginLeft: "13px",
                            fontSize: "small",
                            opacity: "0.6"
                        }}
                    >
                        {dayjs(comment.createdAt).utc(true).fromNow()}
                    </div>
                </div>
            </Stack>
        </div>
    )
}

export function UserFullName({
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
            underline="hover"
            style={{
                wordWrap: "break-word",
                fontSize: "inherit",
                color: "inherit",
                textDecorationColor: "inherit",
                fontWeight: "bold",
                ...style
            }}
        >
            {user.fullName}
        </Link>
    )
}

function CommentForm({
    entityType,
    entityId,
    onPostSuccess,
    variant,
}: {
    entityType: CommentEntityType,
    entityId: number,
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void),
    variant?: CommentSectionVariant,
}) {
    const user = useAuth().user!
    const [value, setValue] = useState<NewComment>({ comment: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
            >
                <UserAvatar
                    userId={user.id}
                    style={{
                        display: isSmallScreen ? "none" : "inherit",
                        marginRight: variant === "normal" ? "17px" : "11px"
                    }}
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
                        disabled={isSubmitting}
                        minRows={variant === "normal" ? 2 : 1}
                        sx={{mb: variant === "normal" ? 4 : 2}}
                        style={{
                            marginTop: variant === "normal" ? "0px" : "-6px"
                        }}
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
                        size={variant === "normal" ? "medium" : "small"}
                    >
                        Kommenter
                    </LoadingButton>
                </div>
            </Stack>
        </form>
    )
}