import { useQuery } from '@tanstack/react-query'
import { SongLyric, StrippedSongLyric } from 'common/interfaces'
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

export function LyricPageContainer() {
    const { isLoading, isError, data, error } = useQuery<StrippedSongLyric[]>(["AllLyricData"], () => fetchAsync<StrippedSongLyric[]>("/api/song-lyric/simple-list"))

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
    const lyricData = useOutletContext<StrippedSongLyric[]>()
    return (
        <>
            <h1>Studenttraller</h1>
            <UrlList>
                {lyricData.map(lyric => <UrlListItem key={lyric.id} to={`/studenttraller/${lyric.title}`} text={lyric.title} />)}
            </UrlList>
        </>
    )
}

export function LyricItemPage() {
    const params = useParams();
    const title = params.title;

    useTitle(title)

    const { isLoading, isError, data } = useQuery<SongLyric>(["LyricItem", title], () => fetchAsync<SongLyric>(`/api/song-lyric/${title}`))

    if (isLoading) {
        return <></>
    }

    if (isError) {
        return <Navigate to="/studenttraller" replace={true} />
    }

    return (
        <>
            <h2>{data.title}</h2>
            <div>
                {data.content}
            </div>
        </>
    )
}