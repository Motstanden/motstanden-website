import { Skeleton } from "@mui/material";

export {
    PageSkeleton as RumourPageSkeleton,
    ListSkeleton as RumourListSkeleton,
    ItemSkeleton as RumourItemSkeleton,
}

function PageSkeleton() {
    return (
        <>
            <h1>Ryktebørsen</h1>
            <h3>Har du hørt at...</h3>
            <div style={{ marginLeft: "10px" }}>
                <ListSkeleton length={20} />
            </div>
        </>
    );
}

function ListSkeleton({ length }: { length: number; }) {
    return (
        <ul style={{
            paddingLeft: "5px",
            listStyleType: "none",
        }}>
            {Array(length).fill(1).map((_, i) => (
                <li key={i}>
                    <ItemSkeleton/>
                </li>
            ))}
        </ul>
    );
}

function ItemSkeleton() {
    return (
        <div style={{ marginBottom: "30px" }}>
            <Skeleton style={{ maxWidth: "700px", height: "2.5em" }} />
            <Skeleton style={{ maxWidth: "95px", height: "1em", marginLeft: "25px" }} />
        </div>
    )
}
