import { Skeleton } from "@mui/material";

export { PollOptions as PollOptionsSkeleton };

function PollOptions({ length }: { length?: number; }) {
    length = length ?? 3;
    return (
        <div>
            <div style={{ marginBottom: "15px", marginTop: "10px" }}>
                <Skeleton
                    variant="text"
                    height="15px"
                    width="240px" />
            </div>
            {Array(length).fill(1).map((_, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    <Skeleton
                        variant="text"
                        style={{
                            width: "200px",
                            height: "32px"
                        }} />
                    <Skeleton
                        variant="rounded"
                        style={{
                            height: "40px",
                        }} />
                </div>
            ))}
            <Skeleton
                variant="rounded"
                style={{
                    height: "30px",
                    width: "160px",
                    marginTop: "30px",
                    marginBottom: "15px"
                }} />
        </div>
    );
}
