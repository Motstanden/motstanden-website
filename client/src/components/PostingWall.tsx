import { Divider, Paper, Skeleton, Stack, useTheme } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { WallPost } from "common/interfaces"
import dayjs from "dayjs"
import { fetchAsync } from "src/utils/fetchAsync"
import { CommentSection, CommentSectionSkeleton, UserAvatar, UserFullName } from "./CommentSection"

export function PostingWall({
    userId,
    style,
}: {
    userId?: number,
    style?: React.CSSProperties
}) {
    const queryKey: any[] = ["wall-post"]
    if (userId) {
        queryKey.push(userId)
    }
    
    return (
        <section
            style={{
                maxWidth: "650px",
                ...style
            }}
        >
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

function PostSectionSkeleton({length}: {length: number}) {
    return(
        <>
            {Array(length).fill(1).map((_, index) => (
                <PostItemSkeleton 
                    key={index} 
                    style={{
                        marginBottom: "20px"
                    }}
                />

            ))}
        </>
    )
}

function PostItemSkeleton( {
    style
}: {
    style?: React.CSSProperties
}) {
    const theme = useTheme()
    return (
        <Paper
            elevation={2}
            style={{
                padding: "20px",
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
            <PostItem
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

function PostItem({
    post,
    style
}: {
    post: WallPost,
    style?: React.CSSProperties
}) {

    const theme = useTheme()

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
                padding: "20px",
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
                    <Stack
                        direction="row"
                        alignItems="center"
                    >
                        <UserFullName
                            userId={post.createdBy}
                            />
                        {post.createdBy !== post.wallUserId && (
                            <>
                                <span 
                                    style={{
                                        marginInline: "3px",
                                        fontSize: "16pt",
                                        opacity: 0.5,
                                        marginBottom: "-2px"
                                    }}
                                >
                                    ▸
                                </span>
                                <UserFullName 
                                    userId={post.wallUserId}
                                />
                            </>   
                        )}
                    </Stack>
                    <div style={{
                        fontSize: "small",
                        opacity: 0.6,
                        marginTop: post.wallUserId === post.createdBy ? "0px" : "-3px"
                    }}>
                        {formatDate(post.createdAt)}
                    </div>
                </div>
            </Stack>
            <div 
                style={{
                    marginTop: "15px",
                    marginLeft: "5px",
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