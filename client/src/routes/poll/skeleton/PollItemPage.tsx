import { PollItemPageHeader } from "../PollItemPage";
import { PollCommentSectionSkeleton } from "./CurrentPollPage";
import { PollCardSkeleton } from "./PollCard";

export { PollItemPage as PollItemPageSkeleton };

function PollItemPage() {
    return (
        <>
            <PollItemPageHeader/>
            <div style={{
                minWidth: "MIN(100%, 500px)",
                maxWidth: "800px"
            }}>
                <PollCardSkeleton />
                <PollCommentSectionSkeleton/>
            </div>
        </>
    );
}