import { useQuery } from "@tanstack/react-query"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useMatch, useOutletContext, useParams } from "react-router-dom"
import { usePotentialUser } from "src/context/Authentication"
import { PageTabItem, TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { strToPrettyUrl } from "src/utils/strToPrettyUrl"
import { LyricEditPageSkeleton } from "./skeleton/EditPage"
import { LyricItemPageSkeleton } from "./skeleton/ItemPage"
import { LyricListPageSkeleton } from "./skeleton/ListPage"

export const lyricContextQueryKey = ["AllLyricData"]

export {
    LyricContainer as LyricContext
}

function LyricContainer() {
    const { isLoggedIn } = usePotentialUser()
    
    let tabItems: PageTabItem[] = [
        { to: "/studenttraller/populaere", label: "Populære" },
        { to: "/studenttraller/alle", label: "Alle", isFallbackTab: true },
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

    const { isListPage, isAllListPage,  isNewPage, isItemPage, isEditPage } = useLyricUrlMatch()

    if (isPending) {
        if(isListPage)
            return <LyricListPageSkeleton numItems={isAllListPage ? 25 : 12}/>

        if(isItemPage)
            return <LyricItemPageSkeleton/>
        
        if(isEditPage)
            return <LyricEditPageSkeleton/>

        if(!isNewPage)      // New page does not depend on the data
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
    const {isItemPage, isEditPage} = useLyricItemUrlMatch()

    if (isPending) {
        if(isItemPage)
            return <LyricItemPageSkeleton/>
        
        if(isEditPage)
            return <LyricEditPageSkeleton/>

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


export function usePendingLyricContext(): {
    isPending: true, 
    lyrics: undefined
} | {
    isPending: false, 
    lyrics: StrippedSongLyric[]
}{
    const context = useOutletContext<StrippedSongLyric[] | undefined>()

    if (context === undefined) 
        return { isPending: true, lyrics: undefined }

    return { isPending: false, lyrics: context }
}

export function useLyricContext() {
    return useOutletContext<StrippedSongLyric[]>()
}

export function useLyricItemContext() {
    return useOutletContext<[StrippedSongLyric[], SongLyric]>()
}

export function buildLyricItemUrl(title: string, isPopular: boolean) {
    return `/studenttraller/${isPopular ? "populaere" : "alle"}/${strToPrettyUrl(title)}`
}

type LyricItemUrlMatch = {
    isItemPage: boolean
    isEditPage: boolean
}

type LyricUrlMatch = LyricItemUrlMatch & {
    isAllListPage: boolean,
    isListPage: boolean,
    isNewPage: boolean,
} 

function useLyricItemUrlMatch(): LyricItemUrlMatch {
    const isItem1 = useMatch("/studenttraller/:songId")
    const isItem2 = useMatch("/studenttraller/populaere/:title") 
    const isItem3 = useMatch("/studenttraller/alle/:title")

    const isEdit1 = useMatch("/studenttraller/:songId/rediger")
    const isEdit2 = useMatch("/studenttraller/populaere/:title/rediger")
    const isEdit3 = useMatch("/studenttraller/alle/:title/rediger")

    return {
        isItemPage: !!(isItem1 || isItem2 || isItem3),
        isEditPage: !!(isEdit1 || isEdit2 || isEdit3),
    }
}

function useLyricUrlMatch(): LyricUrlMatch {

    const isPopularList1 = useMatch("/studenttraller")
    const isPopularList2 = useMatch("/studenttraller/populaere")
    const isAllList = useMatch("/studenttraller/alle")

    const isNew = useMatch("/studenttraller/ny")

    const {isEditPage, isItemPage} = useLyricItemUrlMatch()

    return {
        isAllListPage: !!isAllList,
        isListPage: !!(isPopularList1 || isPopularList2 || isAllList),
        isNewPage: !!isNew,
        isItemPage: isItemPage && !isNew,
        isEditPage: isEditPage,
    }
}