import { QuoteFeedItem } from "common/types"

export {
    Quote as QuoteFeedItem
}

function Quote({ data }: {data: QuoteFeedItem }) {
    return (
        <>
            {data.quote}
        </>
    )
}