import { useQuery } from '@tanstack/react-query'
import { SongLyric, StrippedSongLyric } from 'common/interfaces'
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

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
    const lyric = useOutletContext<SongLyric>()
    useTitle(lyric.title)
    return (
        <>
            <h2>{lyric.title}</h2>
            <div>
                {lyric.content}
            </div>
        </>
    )
}