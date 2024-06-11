import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from "@mui/lab";
import { Button, Divider, Paper, Skeleton, Stack, SxProps, TextField, Theme, useMediaQuery, useTheme } from "@mui/material";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentEntityType, LikeEntityType } from "common/enums";
import { NewWallPost, WallPost } from "common/interfaces";
import { isNullOrWhitespace } from 'common/utils';
import dayjs from "dayjs";
import { useState } from "react";
import { useAuthenticatedUser } from "src/context/Authentication";
import { useUserReference } from 'src/context/UserReference';
import { useQuerySuccess } from 'src/hooks/useQuerySuccess';
import { StorageKeyArray, useSessionStorage } from 'src/hooks/useStorage';
import { deleteRequest } from 'src/utils/deleteRequest';
import { fetchFn } from "src/utils/fetchAsync";
import { postJson } from 'src/utils/postJson';
import { CommentSection, CommentSectionSkeleton } from "../CommentSection";
import { LinkifiedText } from '../LinkifiedText';
import SubmitFormButtons from '../form/SubmitButtons';
import { LikeButton, LikeButtonSkeleton } from '../likes/LikeButton';
import { LikeListEmojiContent } from '../likes/LikeListButton';
import { LikesContextProvider, useLikes } from '../likes/LikesContext';
import { UserLikesModal, useLikesModal } from '../likes/UserLikesModal';
import { CopyLinkMenuItem } from '../menu/CopyLinkMenuItem';
import { DeleteMenuItem } from '../menu/DeleteMenuItem';
import { EditMenuItem } from '../menu/EditMenuItem';
import { IconPopupMenu } from '../menu/IconPopupMenu';
import { UserAvatar } from '../user/UserAvatar';
import { UserFullName } from '../user/UserFullName';

export function PostingWall({
    userId,
    style,
    userFirstName,
    onPostSuccess,
    onLoadedPosts
}: {
    userId?: number,
    userFirstName?: string,
    style?: React.CSSProperties
    onPostSuccess?: (() => Promise<void>) | (() => void),
    onLoadedPosts?: () => void
}) {
    const { user: currentUser } = useAuthenticatedUser()

    const queryClient = useQueryClient()

    const queryKey: StorageKeyArray = ["wall-post", userId ?? "all"]

    const handlePostSuccess = async () => {
        await queryClient.invalidateQueries({queryKey: queryKey})
        await onPostSuccess?.()
    }

    return (
        <section
            style={{
                maxWidth: "650px",
                ...style
            }}
        >
            <PostForm
                onPostSuccess={handlePostSuccess}
                storageKey={queryKey}
                initialValue={{
                    content: "",
                    wallUserId: userId ?? currentUser.id,
                }} 
                style={{
                    marginBottom: "20px"
                }} 
                userFirstName={userFirstName}
            />
            <PostSectionFetcher 
                queryKey={queryKey}
                userId={userId}
                onLoadedPosts={onLoadedPosts}
            />
        </section>
    )
}

function PostSectionFetcher({
    queryKey,
    userId,
    onLoadedPosts,
}: {
    queryKey: QueryKey
    userId?: number,
    onLoadedPosts?: () => void
}) {
    
    let url = "/api/wall-posts/all"
    if(userId)
        url += `?userId=${userId}`

    const { isPending, isError, data, error, isSuccess } = useQuery<WallPost[]>({
        queryKey: queryKey,
        queryFn: fetchFn<WallPost[]>(url), 
    })

    useQuerySuccess({isSuccess}, onLoadedPosts)

    if(isPending) {
        return <PostSectionSkeleton length={6} />
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <PostSection posts={data} queryKey={queryKey}/>
    )
}

export function PostSectionSkeleton({length}: {length: number}) {
    return(
        <>
            {Array(length).fill(1).map((_, index) => (
                <PostSectionItemSkeleton 
                    key={index} 
                    style={{
                        marginBottom: "20px"
                    }}
                />

            ))}
        </>
    )
}

function PostSectionItemSkeleton( {
    style
}: {
    style?: React.CSSProperties
}) {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <Paper
            elevation={2}
            style={{
                paddingBlock: "20px",
                paddingInline: isSmallScreen ? "10px" : "20px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme.palette.divider,
                ...style
            }}
        >
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                <Skeleton 
                    variant="circular"
                    height="40px"
                    width="40px"
                />
                <div>
                    <Skeleton 
                        variant="text"
                        style={{
                            width: "150px",
                        }}
                    />
                    <Skeleton 
                        variant="text"
                        style={{
                            width: "100px",
                            fontSize: "small"
                        }}
                    />
                </div>
            </Stack>
            <Skeleton 
                variant="rounded"
                style={{
                    marginTop: "15px",
                    height: "80px",
                    marginBottom: "15px"
                }}
            />
            <Stack direction="row" justifyContent="space-between">
                <LikeButtonSkeleton/>
                <LikeListSkeleton/>
            </Stack>

            <Divider sx={{mb: 3, mt: 1}} />
            <CommentSectionSkeleton variant="compact" />
        </Paper>
    )
}

function PostSection( {posts, queryKey}: {posts: WallPost[], queryKey: QueryKey}) {
    return (
        <>
            {posts.map((post) => (
                <LikesContextProvider
                    key={post.id}
                    entityType={LikeEntityType.WallPost}
                    entityId={post.id}
                >
                    <PostSectionItem
                        post={post}
                        queryKey={queryKey}
                        style={{
                            marginBottom: "20px"
                        }}
                    />
                </LikesContextProvider>
            ))}
        </>
    )
}

export function PostSectionItem({
    post,
    queryKey,
    style
}: {
    post: WallPost,
    queryKey: QueryKey,
    style?: React.CSSProperties
}) {
    const queryClient = useQueryClient()

    const editItem = useMutation({
        mutationFn: async (newPost: WallPost) => { 
            // Simulate long post
            await new Promise(resolve => setTimeout(resolve, 3000))
        },
        onError: () => {
            // todo
        },
        onSuccess: async () => { 
            return await queryClient.invalidateQueries({queryKey: queryKey})
        },
        retry: 3,
    })

    const deleteItem = useMutation({
        mutationFn: async () => { 
            return await deleteRequest(`/api/wall-posts/${post.id}`)
        },
        onError: () => {
            window.alert("Fikk ikke til å slette posten.\nSi ifra til webansvarlig!")
        },
        onSuccess: async () => { 
            return await queryClient.invalidateQueries({queryKey: queryKey})
        },
    })

    const [isEditing, setIsEditing] = useState(false)

    const onEditClick = () => {
        setIsEditing(true)
    }

    const onPostEdit = (newPost: WallPost) => { 
        editItem.mutate(newPost)
        setIsEditing(false) 
    }

    const onAbortEditClick = () => { 
        setIsEditing(false)
    }

    const onDeleteClick = () => { 
        if(window.confirm("Vil du permanent slette denne posten?")) {
            deleteItem.mutate()
        }
    }

    if(deleteItem.isPending)
        return <></>

    return (
        <Paper 
            elevation={2}
            aria-label='Veggpost'
            sx={{
                paddingBlock: "20px",
                paddingInline: {xs: "10px", sm: "20px"},
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme => theme.palette.divider,
                ...style,
            }}
        >
            <PostItemHeader 
                post={post}
                onDeleteClick={onDeleteClick}
                onEditClick={onEditClick}
            />
            {!isEditing && ( 
                <PostItemContent post={editItem.isPending ? editItem.variables : post}/>
            )}
            {isEditing && (
                <EditPostForm 
                    initialValue={post}
                    onAbortClick={onAbortEditClick}
                    onSubmit={onPostEdit}
                />
            )}
            <Divider sx={{mb: 3, mt: 1}} />
            <CommentSection
                entityType={CommentEntityType.WallPost}
                entityId={post.id}
                variant="compact"
            />
        </Paper>
    )
}

function PostItemHeader({
    post,
    onEditClick,
    onDeleteClick
}: {
    post: WallPost,
    onEditClick?: VoidFunction,
    onDeleteClick?: VoidFunction
}) {
    return (
        <Stack 
            direction="row"
            justifyContent="space-between"
            alignItems="center"                
            >
            <HeaderText
                createdBy={post.createdBy}
                wallId={post.wallUserId}
                createdAt={post.createdAt}
            />
            <HeaderMenu 
                post={post}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                sx={{
                    marginRight: "-5px"
                }}    
            />
        </Stack>
    )
}

function HeaderText( {
    createdBy,
    wallId,
    createdAt,
}: {
    createdBy: number,
    wallId: number,
    createdAt: string
}) {

    const formatDate = (dateString: string): string => {
        const date = dayjs.utc(dateString)
        const now = dayjs()
        if(date.isAfter(now.subtract(4, "day"))) {
            return date.fromNow()
        }

        if(date.isSame(now, "year")) {
            return date.format("D MMMM")
        }

        return date.format("D MMMM, YYYY")
    }

    return (
        <Stack 
            direction="row"
            spacing={1.5}
            alignItems="center"
        >
            <UserAvatar
                userId={createdBy}
                style={{
                    
                }}
            />
            <div>
                <div>
                    <UserFullName 
                        userId={createdBy} 
                        style={{
                            marginRight: "3px"
                        }}
                    />
                    {createdBy !== wallId && (
                        <>
                            <ArrowRightIcon 
                                style={{
                                    fontSize: "16pt",
                                    opacity: 0.5,
                                    marginBottom: "-5px",
                                    marginRight: "3px"
                                }}
                            />
                            <UserFullName 
                                userId={wallId}
                                style={{
                                    marginTop: "-10px"
                                }}
                            />
                        </>   
                    )}
                </div>
                <div style={{
                    fontSize: "small",
                    opacity: 0.6,
                }}>
                    {formatDate(createdAt)}
                </div>
            </div>
        </Stack>
    )
}

function HeaderMenu( {
    post, 
    sx,
    onEditClick,
    onDeleteClick
}: {
    post: WallPost, 
    sx: SxProps,
    onEditClick?: VoidFunction
    onDeleteClick?: VoidFunction
}) {

    const { isAdmin, user } = useAuthenticatedUser()
    const canEdit = user.id === post.createdBy
    const canDelete = canEdit || isAdmin || user.id === post.wallUserId  

    return (
        <IconPopupMenu
            icon={<MoreHorizIcon />}
            ariaLabel='Veggpostmeny'
            sx={{
                p: {xs: 0.65, sm: 1},
                ...sx,
            }}
        >
            <CopyLinkMenuItem linkValue={`${window.location.origin}/vegg/${post.id}`} 
                divider={canEdit || canDelete}
            />
            {canEdit && ( 
                <EditMenuItem divider={canDelete} onClick={onEditClick}/>
            )}
            {canDelete && (
                <DeleteMenuItem onClick={onDeleteClick}/>
            )}
        </IconPopupMenu>
    )
}

function PostItemContent({ post }: { post: WallPost }) {
    return (
        <>
            <div 
                style={{
                    marginTop: "15px",
                    marginLeft: "5px",
                    whiteSpace: "pre-line",
                    marginBottom: "15px"
                }}
            >
                <LinkifiedText>
                    {post.content}
                </LinkifiedText>
            </div>
            <Stack direction="row" justifyContent="space-between">
                <div>
                    <LikeButton
                        style={{
                            padding: "0px",
                            paddingInline: "6px",
                            minWidth: "0px",
                        }}
                    />
                </div>
                <LikeList/>
            </Stack>
        </>
    )
}

function LikeList() {
    const { likes, isPending } = useLikes()
    const { userReference } = useUserReference()
    const isSmallScreen = useMediaQuery("(max-width: 675px)")       // We will consider this a small screen because the side drawer is docked at this width

    const { openModal } = useLikesModal()
    const onClick = () => { 
        openModal()
    }

    if(isPending) 
        return <LikeListSkeleton/>

    if(likes.length <= 0)
        return <></>
    
    let text = ""
    if(userReference) {

        const name = userReference[likes[0].userId].shortFullName

        if(likes.length === 1)
            text = `${name}` 

        if(likes.length === 2) {
            text = `${name} og ${userReference[likes[1].userId].shortFullName}` 

            const maxLength = 40
            if(text.length > maxLength && isSmallScreen) {
                text = `${name} og 1 annen`
            }
        }

        if(likes.length > 2) {
            text = `${name} og ${likes.length - 1} andre`
        }
    }

    return (
        <>
            <Button 
                color="secondary"
                variant="text"
                onClick={onClick}
                style={{
                    minWidth: "0px",
                    padding: "0px 5px",
                    textTransform: "none",
                    alignItems: "flex-start",
                    textAlign: "left",
                }}
                sx={{
                    color: (theme) => theme.palette.text.primary
                }}
            >
                    <LikeListEmojiContent 
                        maxItems={isSmallScreen && !isNullOrWhitespace(text) ? 2 : 3} 
                        showCount={isNullOrWhitespace(text)}
                        />
                    {text && (
                        <div style={{
                            fontWeight: "bold",
                            marginLeft: "3px",
                            opacity: 0.6,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>
                            {text}
                        </div>
                    )}
            </Button>
            <UserLikesModal/> 
        </>
    )
}

function LikeListSkeleton() {
    return ( 
        <Skeleton width={130} />
    )
}

const selfGreetLabels: string[] = [
    `Hva tenker du på...?`,
    `Hva gjør du nå...?`,
    `Hvilke planer har du i dag...?`,
    `Fortell noe om deg selv...`,
    `Hva skjer...?`,
    `Hva spiste du til middag...?`,
    `Hva er planene for helgen...?`,
    `Kommer du på øvelse...?`,
    `Si noe personlig om deg selv...`,
    `Hva er din favorittfilm...?`,
    `Hva er din favorittserie...?`,
    `Hva er din favorittbok...?`,
    `Hva er din dypeste hemmelighet...?`,
    `Hvordan er formen...?`,
    `Hva gjorde du i helgen...?`,
    `Hva er din favorittligning i matematikken...?`,
    `Hvem er din favorittforeleser...?`,
    `Hva er din favorittligning i fysikken...?`,
    `Hva er din favorittligning innefor elektro...?`,
]

const friendGreetLabels = (name: string) : string[] => [
    `Si hei til ${name}...`,
    `Gi en hilsen til ${name}...`,
    `Lovpris ${name}...`,
    `Fortell ${name} hva du tenker på...`,
    `Gratuler ${name} med dagen...??`,
    `Si noe fint til ${name}...`,
    `Si noe personlig til ${name}...`,
]

function useRandomLabel(isSelf: boolean, userFirstName?: string) {
    const [value] = useState(() => {

        const labels = !isSelf && userFirstName 
            ? friendGreetLabels(userFirstName)
            : selfGreetLabels 
    
        const label = labels[Math.floor(Math.random() * labels.length)]

        return label
    })
    
    return value
}

function PostForm({
    initialValue,
    storageKey,
    style,
    onPostSuccess,
    userFirstName,
}: {
    initialValue: NewWallPost,
    storageKey: StorageKeyArray,
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void),
    style?: React.CSSProperties,
    userFirstName?: string
}) {
    const theme = useTheme()

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const { user } = useAuthenticatedUser()
    const isSelf = user.id === initialValue.wallUserId
    const label = useRandomLabel(isSelf, userFirstName)

    const [value, setValue, clearValue] = useSessionStorage<NewWallPost>({
        initialValue: initialValue,
        key: storageKey
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => { 
        e.preventDefault()
        setIsSubmitting(true)

        const newValue: NewWallPost = {
            ...value,
            content: value.content.trim()
        }

        const response = await postJson(`/api/wall-posts/new`, newValue, { alertOnFailure: true })

        if (response && response.ok) {
            onPostSuccess && await onPostSuccess(response)
            setValue(initialValue)
        }

        clearValue()
        setIsSubmitting(false)
    }

    const disabled = isNullOrWhitespace(value.content)

    return (
        <Paper
            elevation={2}
            style={{
                paddingBlock: "20px",
                paddingInline: isSmallScreen ? "10px" : "20px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme.palette.divider,
                ...style,
            }}
        >
            <form onSubmit={onSubmit}>
                <Stack 
                    direction="row"
                >
                    <UserAvatar
                        userId={user.id}
                        style={{
                            marginTop: "5px",
                            display: isSmallScreen ? "none" : "inherit",
                            marginRight: "12px"
                        }}
                    />
                    <div 
                        style={{
                            width: "100%"
                        }}>
                        <TextField 
                            type="text"
                            label={label}
                            required
                            fullWidth
                            multiline
                            autoComplete="off"
                            aria-label='Skriv en ny veggpost...'
                            minRows={1}
                            value={value.content}
                            onChange={(e) => setValue(oldVal => ({...oldVal, content: e.target.value}))}
                            sx={{
                                mb: 3
                            }}
                            disabled={isSubmitting}
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
                            Post
                        </LoadingButton>
                    </div>
                </Stack>
            </form>
        </Paper>
    )
}

function EditPostForm( {
    initialValue,
    onAbortClick,
    onSubmit,
}: {
    initialValue: WallPost,
    onAbortClick?: VoidFunction,
    onSubmit?: (editedPost: WallPost) => void
}) {
    const { user } = useAuthenticatedUser()

    const [value, setValue, clearValue] = useSessionStorage<WallPost>({
        initialValue: initialValue,
        key: ["wall-post", "edit", `${initialValue.id}`, `${user.id}`]
     })

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault()
        const newValue: WallPost = {
            ...value,
            content: value.content.trim()
        }
        onSubmit?.(newValue)
        clearValue()
    }

    const handleAbortClick = () => { 
        clearValue()
        onAbortClick?.()
    }

    const disabled = isNullOrWhitespace(value.content) || value.content.trim() === initialValue.content.trim()

    return (
        <form 
            onSubmit={handleSubmit}
            style={{
                marginTop: "25px",
                marginBottom: "25px"
            }}
        >
            <TextField 
                type="text"
                label="Rediger post..."
                required
                fullWidth
                multiline
                autoComplete="off"
                minRows={1}
                value={value.content}
                onChange={(e) => setValue(oldVal => ({...oldVal, content: e.target.value}))}
                sx={{
                    mb: 3
                }}
            />
            <SubmitFormButtons 
                loading={false}
                onAbort={handleAbortClick}
                disabled={disabled}
            />
        </form>
    )
}