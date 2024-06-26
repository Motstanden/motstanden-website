import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query"
import { WallPost } from "common/interfaces"
import { useAuthenticatedUser } from "src/context/Authentication"
import { useQuerySuccess } from 'src/hooks/useQuerySuccess'
import { StorageKeyArray } from 'src/hooks/useStorage'
import { fetchFn } from "src/utils/fetchAsync"
import { NewPostForm } from './NewPostForm'
import { PostList } from './PostList'
import { PostListSkeleton } from './Skeleton'

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
            <NewPostForm
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
            <PostingWallFetcher 
                queryKey={queryKey}
                userId={userId}
                onLoadedPosts={onLoadedPosts}
            />
        </section>
    )
}

function PostingWallFetcher({
    queryKey,
    userId,
    onLoadedPosts,
}: {
    queryKey: QueryKey
    userId?: number,
    onLoadedPosts?: () => void
}) {
    
    let url = "/api/wall-posts"
    if(userId)
        url += `?wallUserId=${userId}`

    const { isPending, isError, data, error, isSuccess } = useQuery<WallPost[]>({
        queryKey: queryKey,
        queryFn: fetchFn<WallPost[]>(url), 
    })

    useQuerySuccess({isSuccess}, onLoadedPosts)

    if(isPending) {
        return <PostListSkeleton length={6} />
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <PostList posts={data} queryKey={queryKey}/>
    )
}