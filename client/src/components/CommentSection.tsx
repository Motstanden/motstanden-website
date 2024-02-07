import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from "@mui/lab"
import { Paper, Skeleton, Stack, TextField, Theme, useMediaQuery, useTheme } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType, LikeEntityType } from "common/enums"
import { Comment, NewComment } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import dayjs from "dayjs"
import { useLayoutEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { LinkifiedText } from 'src/components/LinkifiedText'
import { useAppBarStyle } from 'src/context/AppBarStyle'
import { useAuthenticatedUser } from "src/context/Authentication"
import { fetchFn } from "src/utils/fetchAsync"
import { postJson } from "src/utils/postJson"
import { LikeButton } from './likes/LikeButton'
import { LikeListIconButton } from './likes/LikeListButton'
import { LikesContextProvider } from './likes/LikesContext'
import { LikeUtils } from './likes/utils'
import { UserAvatar, UserAvatarSkeleton } from './user/UserAvatar'
import { UserFullName } from './user/UserFullName'

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
        await queryClient.invalidateQueries({ queryKey: queryKey })
    }

    return (
        <section
            style={{
                maxWidth: "700px",
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
    const { isPending, isError, data, error } = useQuery<Comment[]>({
        queryKey: queryKey,
        queryFn: fetchFn<Comment[]>(url),
    })

    if(isPending) {
        return <CommentSectionSkeleton variant={variant}/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <CommentSection 
            comments={data} 
            variant={variant} 
            likeEntityType={LikeUtils.convertToLikeEntity(entityType)}
        />
    )
    
}

export function CommentSectionSkeleton( {
    variant,
}: {
    variant?: CommentSectionVariant,
}) {
    const length = variant === "normal" ? 4 : 2
    return (
        <div style={{maxWidth: "700px"}}>
            {Array(length).fill(1).map((_, i) => (
                <CommentItemSkeleton key={i} variant={variant}/>
            ))}
        </div>
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
    likeEntityType,
    variant,
}: {
    comments: Comment[],
    likeEntityType: LikeEntityType,
    variant?: CommentSectionVariant,
}) {
    const { scrollMarginTop } = useAppBarStyle()

    const location = useLocation()
    useLayoutEffect(() => {
        if(location.hash && location.hash.startsWith("#comment-")) {
            const element = document.getElementById(location.hash.substring(1))
            if(element) {
                window.scrollTo({ top: 0, left: 0, behavior: "auto" })
                
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" })
                }, 600);
            }
        }
    }, [])

    return (
        <>
            {comments.map(comment => (
                <LikesContextProvider
                    entityType={likeEntityType} 
                    entityId={comment.id}
                    key={comment.id}
                >
                    <div 
                        id={`comment-${comment.id}`} 
                        style={{
                            scrollMarginTop: `${scrollMarginTop + 10}px`,
                            marginBottom: "15px"
                        }}>
                        <CommentItem 
                            comment={comment}
                            variant={variant ?? "normal"}
                        />
                    </div>
                </LikesContextProvider>
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
    return (
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
            <div style={{
                width: variant === "normal" ? "100%" : undefined,
            }}>
                <div
                    style={{
                        backgroundColor: theme.palette.divider,
                        minWidth: "130px",
                        padding: variant === "normal" ? "12px" : "7px 14px 10px 14px",
                        borderRadius: variant === "normal" ? "10px" : "16px",
                        position: "relative"
                    }}
                >
                    <div>
                        <UserFullName 
                            userId={comment.createdBy}
                            style={{
                                fontSize: variant === "normal" ? "inherit" : "small",
                            }}
                        />
                    </div>
                    <div 
                        style={{
                            whiteSpace: "pre-line"
                        }}>
                        <LinkifiedText>
                            {comment.comment}
                        </LinkifiedText>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            right: "0px",
                            zIndex: 1
                        }}
                    >
                        <Paper
                            style={{
                                borderRadius: "30px",
                                lineHeight: "0px",
                                padding: "0px",
                                margin: "0px",
                            }}
                            elevation={4}
                        >
                            <LikeListIconButton 
                                maxItems={2}
                                style={{
                                    borderRadius: "30px",
                                    fontSize: "13pt",
                                    lineHeight: "15pt",
                                    padding: "0px 2px 1px 2px",
                                }}
                            />
                        </Paper>
                    </div>
                </div>
                <div>
                    <span>
                        <LikeButton 
                            style={{
                                fontSize: "small",
                                marginInline: "4px",
                                minWidth: "40px",
                            }}
                        />
                    </span>
                    <span
                        style={{
                            fontSize: "small",
                            opacity: "0.6",
                        }}
                        >
                        {dayjs.utc(comment.createdAt).fromNow()}
                    </span>
                </div>
            </div>
        </Stack>
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
    const { user } = useAuthenticatedUser()
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