import { SimpleTextKey } from "common/enums"
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { SimpleTextSkeleton } from "src/components/SimpleTextSkeleton";
import { useAppBarHeader } from "src/context/AppBarHeader";
import { useTitle } from "src/hooks/useTitle";
import { PageContainer } from "src/layout/PageContainer/PageContainer";

export function HistoryPage() {
    useTitle("Historie")
    useAppBarHeader("Historie")
    return (
        <PageContainer>
            <article style={{
                maxWidth: "700px", 
                fontSize: "14pt",
                lineHeight: "1.6",
                marginTop: "25px",
            }}>
                <SimpleTextFetcher
                    textKey={SimpleTextKey.HistoryPage} 
                    skeleton={<SimpleTextSkeleton numberOfSections={4}/>}
                />
            </article>
        </PageContainer>
    )
}