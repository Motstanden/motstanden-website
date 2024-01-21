import { Skeleton } from "@mui/material";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { useTitle } from "src/hooks/useTitle";
import { PageContainer } from "src/layout/PageContainer";

const simpleTextKey = "faq-page"

export function FaqPage() {
    useTitle("FAQ")

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
                    skeleton={<TextSkeleton/>}
                />
            </article>
        </PageContainer>
    )
}

function TextSkeleton() {
    return (
        <>
            {/* TODO */}
            <Skeleton variant="rounded" width="100%" height="700px" />
        </>
    )
}