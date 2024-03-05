import { PollCardSkeleton } from "./PollCard";

export { CurrentPollPage as CurrentPollPageSkeleton };

function CurrentPollPage() {
    return (
        <div>
            <h1>Avstemning</h1>
            <div style={{
                marginBottom: "40px",
                display: "inline-block",
                minWidth: "MIN(100%, 500px)",
                maxWidth: "800px"
            }}>
                <PollCardSkeleton />
            </div>
        </div>
    );
}
