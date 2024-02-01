import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { SimpleTextSkeleton } from "src/components/SimpleTextSkeleton";
import { useTitle } from "src/hooks/useTitle";
import { PageContainer } from "src/layout/PageContainer/PageContainer";

const simpleTextKey = "history-page"

export function HistoryPage() {
    useTitle("Historie")

    return (
        <PageContainer>
            <article style={{
                maxWidth: "700px", 
                fontSize: "14pt",
                lineHeight: "1.6",
                marginTop: "25px",
            }}>
                <SimpleTextFetcher
                    textKey={simpleTextKey} 
                    skeleton={<SimpleTextSkeleton numberOfSections={4}/>}
                />
            </article>
        </PageContainer>
    )
}