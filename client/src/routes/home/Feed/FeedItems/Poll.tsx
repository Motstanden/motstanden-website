import { Poll as PollType } from "common/interfaces"
import { PollFeedItem } from "common/types";
import { PollCard } from "src/routes/poll/components/PollCard"

export {
    Poll as PollFeedItem
}

function Poll({ data }: {data: PollFeedItem }) {

    const poll: PollType = {
        id: data.id,
        title: data.title,
        type: data.type,
        createdBy: data.modifiedBy,
        createdAt: data.modifiedAt,

        // Properties that are not in use, but we need to define them to make typescript happy.
        // TODO: Refactor this to avoid defining these properties.
        updatedAt: data.modifiedAt,
        updatedBy: data.modifiedBy,
        createdByName: "",
        updatedByName: "",
    }
    return (
        <div>
            <PollCard poll={poll}/>
        </div>
    )
}