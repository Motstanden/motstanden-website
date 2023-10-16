import { useQuery } from "@tanstack/react-query"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { useAuth } from "src/context/Authentication"
import { TabbedPageContainer } from "src/layout/PageContainer"
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

function PageContainer( {children}: {children?: React.ReactNode} ) {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/studenttraller/populaere", label: "Populære" },
                { to: "/studenttraller/alle", label: "Alle" },
                { to: "/studenttraller/ny", label: "ny" }
            ]}
            matchChildPath={true}
        >
            {children}
        </TabbedPageContainer>
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

    const isPublic = useAuth().user === null
    const url = `/api/${isPublic ? "public" : "private"}/song-lyric/${id}`

    const { isLoading, isError, data } = useQuery<SongLyric>(["LyricItem", isPublic, id], () => fetchAsync<SongLyric>(url))

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