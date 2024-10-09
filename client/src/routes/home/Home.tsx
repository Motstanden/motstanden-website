import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer/PageContainer"

export function HomePage() {
    useAppBarHeader("Hjem")
    useTitle(undefined)

    return (
        <PageContainer>
            Todo...
        </PageContainer>
    )
}