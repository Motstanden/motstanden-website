import { Skeleton } from "@mui/material";

export {
    ListPageSkeleton as QuotesListPageSkeleton,
    ListSkeleton as QuotesListSkeleton,
    ItemSkeleton as QuotesItemSkeleton
}

function ListPageSkeleton() {
    return (
        <>
            <ListSkeleton length={20} />
        </>
    );
}

function ListSkeleton({ length }: { length: number }) {
    return (
        <ul style={{
            paddingLeft: "5px",
            listStyleType: "none"
        }}>
            {Array(length).fill(1).map((_, i) => (
                <li key={i}>
                    <ItemSkeleton />
                </li>
            ))}
        </ul>
    )
}

function ItemSkeleton() {
    return (
        <>
            <div>
                <Skeleton
                    style={{
                        maxWidth: "700px",
                        marginBottom: "-10px",
                        height: "5em"
                    }} />
            </div>
            <div style={{ marginBottom: "25px" }}>
                <Skeleton
                    style={{
                        maxWidth: "650px",
                        marginLeft: "50px",
                        height: "2em"
                    }}
                />
            </div>
        </>
    )
}