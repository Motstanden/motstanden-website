import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { LatestCommentsList } from "./components/LatestCommentsList"

export function CommentsPage() {
    useTitle("Kommentarer")
    useAppBarHeader("Kommentarer")
    return (
        <PageContainer >
            <div style={{maxWidth: "850px"}} >
                <LatestCommentsList/>
            </div>
        </PageContainer>
    )
}
