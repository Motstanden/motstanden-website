import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

export function LyricPageContainer() {
    const { isLoading, isError, data, error } = useQuery<ILyricData[]>(["AllLyricData"], () => fetchAsync<ILyricData[]>("/api/song_lyric"))

    if (isLoading) {
        return <PageContainer><div /></PageContainer>
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }
    return (
        <PageContainer>
            <Outlet context={data} />
        </PageContainer>
    )
}

export function LyricListPage() {
    useTitle("Studenttraller")
    const lyricData = useOutletContext<ILyricData[]>()
    return (
        <>
            <h1>Studenttraller</h1>
            <UrlList>
                {lyricData.map(lyric => <UrlListItem key={lyric.title} to={`/studenttraller/${lyric.title}`} text={lyric.title} />)}
            </UrlList>
        </>
    )
}

export function LyricItemPage() {
    const params = useParams();
    const title = params.title;

    useTitle(title)

    const { isLoading, isError, data } = useQuery<ILyricHtml>(["LyricItem", title], () => {
        if (title) {
            return fetchAsync<ILyricHtml>(`/api/song_lyric_data?title=${title}`)
        }
        else {
            throw new Error("Title is null")
        }
    }, {
        retry: false
    })

    if (isLoading) {
        return <></>
    }

    if (isError) {
        return <Navigate to="/studenttraller" replace={true} />
    }

    return (
        <>
            <h2>{title}</h2>
            <div dangerouslySetInnerHTML={{ __html: data.lyricHtml }} />
        </>
    )
}

interface ILyricData {
    title: string,
    url: string,
    melody?: string,
    textOrigin?: string,
    description?: string
}

interface ILyricHtml {
    lyricHtml: string
}