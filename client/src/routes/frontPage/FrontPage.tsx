import { useQuery } from "@tanstack/react-query";
import { SimpleText } from "common/interfaces";
import { MarkDownRenderer } from "src/components/MarkDownEditor";
import { fetchAsync } from "src/utils/fetchAsync";
import May17Img from "../../assets/pictures/17mai2021.jpg";
import { useTitle } from "../../hooks/useTitle";
import { PageContainer } from "../../layout/PageContainer";

const simpleTextKey = "front-page"
const lyricContextQueryKey = ["AllLyricData", simpleTextKey]

export default function FrontPage() {
    useTitle("Framside")
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
            }}>
                <FrontPageTextLoader/>
            </div>
        </PageContainer>
    )
    
}

function FrontPageTextLoader() {
    const { isLoading, isError, data, error } = useQuery<SimpleText>(lyricContextQueryKey, () => fetchAsync<SimpleText>(`/api/simple-text/${simpleTextKey}`))

    if(isLoading)
        return <TextSkeleton/>

    if(isError)
        return <span>{`${error}`}</span>

    return (
        <MarkDownRenderer value={data.text} />
    )
}


function TextSkeleton() {
    return (
        <div>
            Todo: create skeleton for text
        </div>
    )
}