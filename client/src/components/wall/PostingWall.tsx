import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from "@mui/lab"
import { Button, Divider, Paper, Skeleton, Stack, TextField, Theme, useMediaQuery, useTheme } from "@mui/material"
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType, LikeEntityType } from "common/enums"
import { NewWallPost, WallPost } from "common/interfaces"
import { isNullOrWhitespace } from 'common/utils'
import dayjs from "dayjs"
import { useState } from "react"
import { useAuthenticatedUser } from "src/context/Authentication"
import { useUserReference } from 'src/context/UserReference'
import { useQuerySuccess } from 'src/hooks/useQuerySuccess'
import { StorageKeyArray, useSessionStorage } from 'src/hooks/useStorage'
import { fetchFn } from "src/utils/fetchAsync"
import { postJson } from 'src/utils/postJson'
import { softHypenate } from 'src/utils/softHyphenate'
import { CommentSection, CommentSectionSkeleton } from "../CommentSection"
import { LinkifiedText } from '../LinkifiedText'
import { LikeButton, LikeButtonSkeleton } from '../likes/LikeButton'
import { LikeListEmojiContent } from '../likes/LikeListButton'
import { LikesContextProvider, useLikes } from '../likes/LikesContext'
import { UserLikesModal, useLikesModal } from '../likes/UserLikesModal'
import { UserAvatar } from '../user/UserAvatar'
import { UserFullName } from '../user/UserFullName'

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
        <PostSection posts={data}/>
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

function PostSection( {posts}: {posts: WallPost[]}) {
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
    style
}: {
    post: WallPost,
    style?: React.CSSProperties
}) {

    const theme = useTheme()

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
            <Stack 
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                <UserAvatar
                    userId={post.createdBy}
                    style={{
                        
                    }}
                />
                <div>
                    <div>
                        <UserFullName 
                            userId={post.createdBy} 
                            style={{
                                marginRight: "3px"
                            }}
                        />
                        {post.createdBy !== post.wallUserId && (
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
                                    userId={post.wallUserId}
                                    style={{marginTop: "-10px"

                                    }}
                                />
                            </>   
                        )}
                    </div>
                    <div style={{
                        fontSize: "small",
                        opacity: 0.6,
                    }}>
                        {formatDate(post.createdAt)}
                    </div>
                </div>
            </Stack>
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
                <div style={{minWidth: "105px"}}>
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
            <Divider sx={{mb: 3, mt: 1}} />
            <CommentSection
                entityType={CommentEntityType.WallPost}
                entityId={post.id}
                variant="compact"
            />
        </Paper>
    )
}

function LikeList() {
    const { likes, isPending } = useLikes()
    const { userReference } = useUserReference()
    const isTinyScreen = useMediaQuery("(max-width: 350px)");
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
    if(userReference && !isTinyScreen) {

        const name = userReference[likes[0].userId].fullName

        if(likes.length === 1)
            text = `${name}` 

        if(likes.length === 2) {
            text = `${name} og ${userReference[likes[1].userId].fullName}` 

            const maxLength = 40
            if(text.length > maxLength && isSmallScreen) {
                text = `${name} og 1 annen`
            }
        }

        if(likes.length > 2) {
            text = `${name} og ${likes.length - 1} andre`
        }
        text = softHypenate(text)
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
    const isTinyScreen = useMediaQuery("(max-width: 370px)")
    const isSmallScreen = useMediaQuery("(max-width: 430px)")
    const width = isTinyScreen 
        ? 60 
        : isSmallScreen ? 160 : 240
    return ( 
        <Skeleton width={width} />
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