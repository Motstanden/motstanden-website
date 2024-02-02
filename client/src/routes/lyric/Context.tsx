import { useQuery } from "@tanstack/react-query"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { usePotentialUser } from "src/context/Authentication"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { strToPrettyUrl } from "src/utils/strToPrettyUrl"

export const lyricContextQueryKey = ["AllLyricData"]

export {
    LyricContainer as LyricContext
}

function LyricContainer() {
    const { isLoggedIn } = usePotentialUser()
    
    let tabItems = [
        { to: "/studenttraller/populaere", label: "Populære" },
        { to: "/studenttraller/alle", label: "Alle" },
    ]

    if(isLoggedIn) {
        tabItems.push({ to: "/studenttraller/ny", label: "ny" })
    }

    return (
        <TabbedPageContainer
            tabItems={tabItems}
            matchChildPath={true}
        >
            <LyricContextLoader/>
        </TabbedPageContainer>
    )
}

function LyricContextLoader() {

    const { isPending, isError, data, error } = useQuery<StrippedSongLyric[]>({
        queryKey: lyricContextQueryKey,
        queryFn: fetchFn<StrippedSongLyric[]>("/api/song-lyric/simple-list"),
    })

    if (isPending) {
        return <></>
    }

    if (isError) {
        return `${error}`
    }
    
    return (
        <Outlet context={data} />
    )
}

export function LyricItemContext() {
    const allLyrics = useOutletContext<StrippedSongLyric[]>()
    const params = useParams();
    
    const urlTitle = params.title;
    let lyricId = allLyrics.find(item => strToPrettyUrl(item.title) === urlTitle)?.id

    if(!lyricId) {
        const paramId = strToNumber(params.songId)
        lyricId = allLyrics.find(item => item.id === paramId)?.id
    }

    if(!lyricId) 
        return <Navigate to="/studenttraller" replace={true} />

    return <LyricItemLoader id={lyricId} />
}

export const getLyricItemContextQueryKey = (id: number) => ["LyricItem", id]

export function LyricItemLoader( {id}: {id: number}){
    const allLyrics = useOutletContext<StrippedSongLyric[]>()

    const isLoggedIn = !!usePotentialUser().user
    const url = `/api/${isLoggedIn ? "private" : "public"}/song-lyric/${id}`

    const { isPending, isError, data } = useQuery<SongLyric>({
        queryKey: getLyricItemContextQueryKey(id),
        queryFn: fetchFn<SongLyric>(url),
    })

    if (isPending) {
        return <></>
    }

    if (isError) {
        return <Navigate to="/studenttraller/populaere" replace={true} />
    }

    const context = [allLyrics, data]

    return (
        <Outlet context={context} />
    )
}

export function useLyricContext() {
    const context = useOutletContext<StrippedSongLyric[]>()
    return context
}

export function useLyricItemContext() {
    const context = useOutletContext<[StrippedSongLyric[], SongLyric]>()
    return context
}

export function buildLyricItemUrl(title: string, isPopular: boolean) {
    return `/studenttraller/${isPopular ? "populaere" : "alle"}/${strToPrettyUrl(title)}`

}