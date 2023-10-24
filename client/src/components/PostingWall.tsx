import { Divider, Paper, Stack } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { WallPost } from "common/interfaces"
import { fetchAsync } from "src/utils/fetchAsync"
import { CommentSection, UserAvatar, UserFullName } from "./CommentSection"
import dayjs from "dayjs"
import { CommentEntityType } from "common/enums"

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
        return <PostSectionSkeleton length={4}/>
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
        <></> // TODO: Implement skeleton
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
            elevation={1}
            style={{
                padding: "20px",
                ...style
            }}
        >
            <Stack 
                direction="row"
                spacing={1}
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
                    marginTop: "10px"
                }}
            >
                {post.content}
            </div>
            <Divider sx={{my: 3}} />
            <CommentSection
                entityType={CommentEntityType.WallPost}
                entityId={post.id}
            />
        </Paper>
    )
}