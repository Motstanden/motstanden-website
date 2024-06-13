import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType } from "common/enums"
import { Comment } from "common/interfaces"
import { fetchFn } from "src/utils/fetchAsync"
import { LikeUtils } from '../likes/utils'
import { CommentList } from "./CommentList"
import { NewCommentForm } from './NewCommentForm'
import { CommentSectionSkeleton } from "./Skeleton"
import { CommentSectionVariant } from "./types"

export function CommentSection({
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
            <NewCommentForm 
                entityType={entityType}
                entityId={entityId}
                storageKey={queryKey}
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
    queryKey: QueryKey,
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
        <CommentList 
            comments={data} 
            variant={variant} 
            likeEntityType={LikeUtils.convertToLikeEntity(entityType)}
        />
    )
}