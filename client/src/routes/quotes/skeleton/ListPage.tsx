import { Skeleton } from "@mui/material";

export {
    ListPageSkeleton as QuotesListPageSkeleton,
    ListSkeleton as QuotesListSkeleton,
    ItemSkeleton as QuotesItemSkeleton
}

function ListPageSkeleton() {
    return (
        <>
            <h1>Sitater</h1>
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
            {Array(length).fill(1).map((_, i) => <ItemSkeleton key={i} />)}
        </ul>
    )
}

function ItemSkeleton() {
    return (
        <li>
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
        </li>
    )
}