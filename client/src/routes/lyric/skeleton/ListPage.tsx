import { UrlListSkeleton } from "src/components/UrlList"
import { useTitle } from "src/hooks/useTitle"


export {
    ListPageSkeleton as LyricListPageSkeleton
}

function ListPageSkeleton( {numItems} : { numItems: number }) {
    useTitle("Studenttraller")
    return (
        <>
            <UrlListSkeleton length={numItems} />
        </>
    )
}