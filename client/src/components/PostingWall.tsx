import { useQuery } from "@tanstack/react-query"
import { WallPost } from "common/interfaces"
import { fetchAsync } from "src/utils/fetchAsync"

export function PostingWall({
    userId,
}: {
    userId?: number
}) {
    const queryKey: any[] = ["wall-post"]
    if (userId) {
        queryKey.push(userId)
    }
    
    return (
        <>
            <PostSectionFetcher 
                queryKey={queryKey}
                userId={userId}
            />
        </>
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
    console.log(posts)
    return (
        <></> // TODO: Implement post section
    )
}