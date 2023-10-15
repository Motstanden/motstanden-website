import { useQuery } from "@tanstack/react-query"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

export function LyricContext() {
    const { isLoading, isError, data, error } = useQuery<StrippedSongLyric[]>(["AllLyricData"], () => fetchAsync<StrippedSongLyric[]>("/api/song-lyric/simple-list"))

    if (isLoading) {
        return <PageContainer/>
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

export function LyricItemContext() {
    const params = useParams();
    const title = params.title;
    
    const allLyrics = useOutletContext<StrippedSongLyric[]>()
    const lyricId = allLyrics.find(item => item.title === title)?.id

    if(!lyricId) 
        return <Navigate to="/studenttraller" replace={true} />

    return <LyricItemLoader id={lyricId} />
}

export function LyricItemLoader( {id}: {id: number}){
    const { isLoading, isError, data } = useQuery<SongLyric>(["LyricItem", id], () => fetchAsync<SongLyric>(`/api/song-lyric/${id}`))

    if (isLoading) {
        return <></>
    }

    if (isError) {
        return <Navigate to="/studenttraller" replace={true} />
    }

    return (
        <Outlet context={data} />
    )
}