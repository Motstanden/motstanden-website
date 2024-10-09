import { SimpleTextFeedItem } from "common/types";

export {
    SimpleText as SimpleTextFeedItem
}

function SimpleText({ data }: {data: SimpleTextFeedItem }) {
    return (
        <>
            {data.key}
        </>
    )
}