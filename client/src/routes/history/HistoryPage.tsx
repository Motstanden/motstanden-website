import { Skeleton } from "@mui/material";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { useTitle } from "src/hooks/useTitle";
import { PageContainer } from "src/layout/PageContainer";

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
                    skeleton={<TextSkeleton/>}
                />
            </article>
        </PageContainer>
    )
}

function TextSkeleton() {
    return (
        <div>
            <Skeleton variant="rounded" width={"100%"} />
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
            height="120px"
        />
    )
}