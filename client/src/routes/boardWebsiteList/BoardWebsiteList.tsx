import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer"



export default function DocumentsPage() {
    useTitle("Styrets nettsider")
    return (
        <PageContainer>
            <h1>Styrets nettsider</h1>
        </PageContainer>
    )
}