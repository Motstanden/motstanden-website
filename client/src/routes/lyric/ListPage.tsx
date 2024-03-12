import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { buildLyricItemUrl, useLyricContext } from './Context'

export function LyricListPage( {filterPopular}: {filterPopular?: boolean}  ) {
    useTitle("Studenttraller")
    const lyricData = useLyricContext()
    const lyrics = filterPopular ? lyricData.filter(lyric => lyric.isPopular) : lyricData

    return (
        <>
            <h1>Studenttraller</h1>
            <UrlList>
                {lyrics.map(lyric => (
                    <UrlListItem 
                        key={lyric.id} 
                        to={buildLyricItemUrl(lyric.title, filterPopular === true)} 
                        text={lyric.title} />
                ))}
            </UrlList>
        </>
    )
}

