import { StrippedSongLyric } from 'common/interfaces'
import { useOutletContext } from "react-router-dom"
import { strToPrettyUrl } from 'src/utils/strToPrettyUrl'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { useTitle } from "../../hooks/useTitle"
import { useLyricContext } from './Context'

export function LyricListPage( {filterPopular}: {filterPopular?: boolean}  ) {
    useTitle("Studenttraller")
    const lyricData = useLyricContext()
    const lyrics = filterPopular ? lyricData.filter(lyric => lyric.isPopular) : lyricData

    const buildUrl = (lyric: StrippedSongLyric) => {
        return `/studenttraller/${filterPopular ? "populaere" : "alle"}/${strToPrettyUrl(lyric.title)}`
    }

    return (
        <>
            <h1>Studenttraller</h1>
            <UrlList>
                {lyrics.map(lyric => (
                    <UrlListItem 
                        key={lyric.id} 
                        to={buildUrl(lyric)} 
                        text={lyric.title} />
                ))}
            </UrlList>
        </>
    )
}

