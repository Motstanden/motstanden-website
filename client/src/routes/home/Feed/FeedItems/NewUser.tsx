import { NewUserFeedItem } from "common/types"

export {
    NewUser as NewUserFeedItem
}

function NewUser({ data }: {data: NewUserFeedItem }) {
    return (
        <>
            {data.fullName}
        </>
    )
}