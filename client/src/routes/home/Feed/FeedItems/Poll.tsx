import { PollFeedItem } from "common/types";

export {
    Poll as PollFeedItem
}

function Poll({ data }: {data: PollFeedItem }) {
    return (
        <>
            {data.title}
        </>
    )
}