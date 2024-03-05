import { PollCardSkeleton } from "./PollCard";

export { PollPage as PollPageSkeleton };

function PollPage() {
    return (
        <div>
            <h1>Avstemning</h1>
            <div style={{
                marginBottom: "40px",
                display: "inline-block",
                minWidth: "MIN(100%, 500px)"
            }}>
                <PollCardSkeleton />
            </div>
        </div>
    );
}
