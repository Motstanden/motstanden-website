import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem, UrlListSkeleton } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer/PageContainer"
import { fetchFn } from "../../utils/fetchAsync"

export default function DocumentsPage() {
    useTitle("Dokumenter")
    return (
        <PageContainer>
            <h1>Dokumenter</h1>
            <DocumentList />
        </PageContainer>
    )
}

function DocumentList() {

    const { isPending, isError, data, error } = useQuery<Document[]>({
        queryKey: ["FetchDocuments"],
        queryFn: fetchFn<Document[]>("/api/documents"),
    })

    if (isPending) {
        return <UrlListSkeleton length={3}/>
    }

    if (isError) {
        return `${error}`
    }
    return (
        <UrlList>
            <>
                <UrlListItem
                    externalRoute
                    to="https://statutter.motstanden.no" 
                    type="application/pdf"
                    text="Motstandens Statutter"/>
                <UrlListItem
                    externalRoute
                    to="https://manifest.motstanden.no" 
                    type="application/pdf"
                    text="Motstandens Propaganda 2023"/>
                {data.map(doc => 
                    <UrlListItem 
                        key={doc.url} 
                        to={`/${doc.url}`} 
                        text={doc.title} 
                        type="application/pdf" 
                        reloadDocument />)}
            </>
        </UrlList>
    )
}

interface Document {
    title: string,
    url: string
}
