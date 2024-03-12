import { Skeleton } from "@mui/material";
import { useTitle } from "src/hooks/useTitle";

export {
    ListPageSkeleton as EventListPageSkeleton
};

function ListPageSkeleton() {
    useTitle("Arrangement")
    return (
        <>
            <h1>Arrangement</h1>
            <div style={{ maxWidth: "750px" }}>
                {Array(4).fill(1).map( (_, index) => (
                    <EventItemSkeleton key={index} />
                ))}
            </div>
        </>
    );
}

function EventItemSkeleton() {
    return (
        <Skeleton 
            variant="rounded" 
            sx={{ mb: 4 }}
            height="200px"
        />
    )
}