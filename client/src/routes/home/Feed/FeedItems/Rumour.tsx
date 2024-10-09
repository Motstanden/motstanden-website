import { RumourFeedItem } from "common/types";

export {
    Rumour as RumourFeedItem
}

function Rumour({ data }: {data: RumourFeedItem }) {
    return (
        <>
            {data.rumour}
        </>
    )
}