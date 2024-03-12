import { Skeleton } from "@mui/material";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import { useTitle } from "src/hooks/useTitle";
import { PageContainer } from "src/layout/PageContainer/PageContainer";

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

function TextSkeleton( {length = 6}: {length?: number} ) {
    return (
        <>
            <div style={{
                marginBlock: "30px"
            }}>
            <Skeleton 
                variant="text" 
                width="280px" 
                height="3em"
                />
            </div>
            {Array(length).fill(1).map((_, i) => (
                <div key={i}>
                    <Skeleton 
                        variant="text" 
                        width="250px"/>
                    <Skeleton 
                        variant="text" 
                        width="100%"
                        height="6em"
                        />
                    <br/>
                </div>
            ))}
        </>
    )
}