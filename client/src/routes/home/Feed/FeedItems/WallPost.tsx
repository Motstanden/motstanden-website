import { LikeEntityType } from "common/enums"
import { WallPost as WallPostType } from "common/interfaces"
import { WallPostFeedItem } from "common/types"
import { LikesContextProvider } from "src/components/likes/LikesContext"
import { PostSectionItem } from "src/components/PostingWall"

export {
    WallPost as WallPostFeedItem
}

function WallPost({ data }: {data: WallPostFeedItem }) {

    const post: WallPostType = {
        ...data,
        createdBy: data.modifiedBy,
        createdAt: data.modifiedAt,
    }
    return (
        <LikesContextProvider
            entityType={LikeEntityType.WallPost}
            entityId={data.id}
        >
            <PostSectionItem post={post} queryKey={["feed"]}/>
        </LikesContextProvider>
    )
}