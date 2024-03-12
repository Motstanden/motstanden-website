import { Skeleton } from "@mui/material"

export function SimpleTextSkeleton({
    numberOfSections = 1,
    style,
}: {
    numberOfSections?: number
    style?: React.CSSProperties
}) {
    return (
        <div>
            {Array(numberOfSections).fill(1).map((_, i) => ( 
                <SectionSkeleton key={i}/>
            ))}
        </div>
    )
}

function SectionSkeleton() { 
    return (
        <>
            <TitleSkeleton/>
            <ContentSkeleton/>
        </>
    )
}

function TitleSkeleton() {
    return (
        <div style={{
            marginBlock: "30px"
        }}>
            <Skeleton 
                variant="text" 
                width="280px" 
                height="3em"
                />
        </div>
    )
}

function ContentSkeleton() {
    return (
        <Skeleton
            variant="rounded"
            width="100%"
            height="150px"
        />
    )
}