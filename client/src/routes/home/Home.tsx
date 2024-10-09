import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { Feed } from "./Feed/Feed"

export function HomePage() {
    useAppBarHeader("Hjem")
    useTitle(undefined)

    return (
        <PageContainer>
            <Feed/>
        </PageContainer>
    )
}