import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import SendIcon from '@mui/icons-material/Send'
import { LoadingButton } from "@mui/lab"
import { Divider, Paper, Skeleton, Stack, TextField, Theme, useMediaQuery, useTheme } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { NewWallPost, WallPost } from "common/interfaces"
import { isNullOrWhitespace } from 'common/utils'
import dayjs from "dayjs"
import { useState } from "react"
import { useAuth } from "src/context/Authentication"
import { fetchAsync } from "src/utils/fetchAsync"
import { postJson } from 'src/utils/postJson'
import { CommentSection, CommentSectionSkeleton, UserAvatar, UserFullName } from "./CommentSection"

export function PostingWall({
    userId,
    style,
    userFirstName
}: {
    userId?: number,
    userFirstName?: string,
    style?: React.CSSProperties
}) {
    const currentUser = useAuth().user!

    const queryClient = useQueryClient()

    const queryKey: any[] = ["wall-post"]
    if (userId) {
        queryKey.push(userId)
    }

    const onPostSuccess = async () => {
        await queryClient.invalidateQueries(queryKey)
    }

    return (
        <section
            style={{
                maxWidth: "650px",
                ...style
            }}
        >
            <PostForm
                onPostSuccess={onPostSuccess}
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
            />
        </section>
    )
}

function PostSectionFetcher({
    queryKey,
    userId,
}: {
    queryKey: any[]
    userId?: number
}) {
    
    let url = "/api/wall-posts/all"

    if(userId)
        url += `?userId=${userId}`
    const { isLoading, isError, data, error } = useQuery<WallPost[]>(queryKey, () => fetchAsync<WallPost[]>(url))

    if(isLoading) {
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
                    height: "80px"
                }}
            />
            <Divider sx={{my: 3}} />
            <CommentSectionSkeleton variant="compact" />
        </Paper>
    )
}

function PostSection( {posts}: {posts: WallPost[]}) {
    return (
        <>
        {posts.map((post) => (
            <PostSectionItem
                key={post.id}
                post={post}
                style={{
                    marginBottom: "20px"
                }}
            />
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
        const date = dayjs(dateString).utc(true)
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
                    whiteSpace: "pre-line"
                }}
            >
                {post.content}
            </div>
            <Divider sx={{my: 3}} />
            <CommentSection
                entityType={CommentEntityType.WallPost}
                entityId={post.id}
                variant="compact"
            />
        </Paper>
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
    const labels = !isSelf && userFirstName 
        ? friendGreetLabels(userFirstName)
        : selfGreetLabels 

    const label = labels[Math.floor(Math.random() * labels.length)]
    const [value, setValue] = useState(label)

    return value
}

function PostForm({
    initialValue,
    style,
    onPostSuccess,
    userFirstName,
}: {
    initialValue: NewWallPost,
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void),
    style?: React.CSSProperties,
    userFirstName?: string
}) {
    const theme = useTheme()

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const user = useAuth().user!
    const isSelf = user.id === initialValue.wallUserId
    const label = useRandomLabel(isSelf, userFirstName)

    const [value, setValue] = useState<NewWallPost>(initialValue)
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