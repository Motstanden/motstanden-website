import { Skeleton } from "@mui/material";
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher";
import May17Img from "../../assets/pictures/17mai2021.jpg";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";
import { useAuth } from "src/context/Authentication";
import { hasGroupAccess } from "common/utils";
import { UserGroup } from "common/enums";

const simpleTextKey = "front-page"

export default function FrontPage() {
    useTitle("Framside")

    const user = useAuth().user
    const isAdmin = !!user && hasGroupAccess(user, UserGroup.Administrator)

    return (
        <PageContainer disableGutters>
            <img src={May17Img}
                alt="Motstanden feirer 17. Mai 2021"
                style={{ 
                    width: "100%", 
                    maxHeight: "33vh", 
                    objectFit: "cover"
                 }}
             />
            <div style={{ 
                paddingInline: "35px", 
                paddingBottom: "100px", 
                maxWidth: "700px",
                fontSize: "14pt",
                lineHeight: "1.6",
                marginTop: "25px"
            }}>
                <SimpleTextFetcher
                    textKey={simpleTextKey} 
                    skeleton={<TextSkeleton/>}
                    canEdit={isAdmin}
                />
            </div>
        </PageContainer>
    )
    
}

function TextSkeleton() {
    return (
        <div>
            <SectionSkeleton/>
            <SectionSkeleton/>
            <SectionSkeleton/>
            <SectionSkeleton/>
        </div>
    )
}

function SectionSkeleton() { 
    return (
        <>
            <div style={{
                marginBlock: "20px"
            }}>
                <TitleSkeleton/>
            </div>
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