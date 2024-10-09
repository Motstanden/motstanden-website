import { WallPostFeedItem } from "common/types";

export {
    WallPost as WallPostFeedItem
}

function WallPost({ data }: {data: WallPostFeedItem }) {
    return (
        <>
            {data.content}
        </>
    )
}