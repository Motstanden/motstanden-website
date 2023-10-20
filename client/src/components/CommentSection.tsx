import { useQuery } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { fetchAsync } from "src/utils/fetchAsync"


export { 
    CommentSectionFetcher as CommentSection
} 

function CommentSectionFetcher({
    entityType,
    entityId,
}: {
    entityType: CommentEntityType,
    entityId: number
}) {

    const queryKey = [entityType, "comments", entityId]
    const url = `/api/${entityType}/${entityId}/comments`
    const { isLoading, isError, data, error } = useQuery<Comment[]>(queryKey, () => fetchAsync<Comment[]>(url))

    if(isLoading) {
        return <CommentSectionSkeleton/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <CommentSection comments={data} />
    )
    
}

function CommentSectionSkeleton() {
    return (
        <></> // TODO: Implement
    )
}

function CommentSection( {comments}: {comments: Comment[]}) {
    console.log(comments)
    return (
        <>Her kommer de kommentarfelt</>
    )
}