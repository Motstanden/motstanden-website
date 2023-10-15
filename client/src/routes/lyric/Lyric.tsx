import { useQuery } from '@tanstack/react-query'
import { SongLyric, StrippedSongLyric } from 'common/interfaces'
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"
import { MarkDownRenderer } from 'src/components/MarkDownEditor'
import { useTheme } from '@mui/material'

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
    const theme = useTheme()
    return (
        <>
            <div style={{
                fontSize: "1.2em", 
                lineHeight: "1.6em",
                color: theme.palette.text.secondary,
            }}>
                <h1>{lyric.title}</h1>
                <MarkDownRenderer value={lyric.content} />
            </div>
        </>
    )
}