import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer/PageContainer"

export function CommentsPage() {
    useTitle("Kommentarer")
    useAppBarHeader("Kommentarer")
    return (
        <PageContainer>
            todo...
        </PageContainer>
    )
}
