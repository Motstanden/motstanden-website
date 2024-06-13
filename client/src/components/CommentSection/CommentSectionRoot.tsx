import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentEntityType, LikeEntityType } from "common/enums"
import { Comment } from "common/interfaces"
import { useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAppBarStyle } from 'src/context/AppBarStyle'
import { fetchFn } from "src/utils/fetchAsync"
import { LikesContextProvider } from '../likes/LikesContext'
import { LikeUtils } from '../likes/utils'
import { CommentItem } from "./CommentItem"
import { NewCommentForm } from './NewCommentForm'
import { CommentSectionSkeleton } from "./Skeleton"

export type CommentSectionVariant = "compact" | "normal"

export function CommentSectionRoot({
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
        <CommentSection 
            comments={data} 
            variant={variant} 
            likeEntityType={LikeUtils.convertToLikeEntity(entityType)}
        />
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