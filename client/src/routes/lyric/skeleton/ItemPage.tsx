import { Skeleton } from "@mui/material"
import { useTitle } from "src/hooks/useTitle"

export {
    ItemPageSkeleton as LyricItemPageSkeleton,
    ItemSkeleton as LyricItemSkeleton
}

function ItemPageSkeleton() {
    useTitle("Studenttraller")
    return (
        <ItemSkeleton/>
    )
}

function ItemSkeleton() {
    return (
        <div>
            <h1>
                <Skeleton
                    variant="text" 
                    width="300px"/>
            </h1>
            <Skeleton
                variant="rounded" 
                width="min(100%, 500px)"
                height="1200px"
                />
        </div>
    )
}