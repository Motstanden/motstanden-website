import { SheetArchiveTitle } from "common/interfaces";
import { useOutletContext } from "react-router-dom";
import { UrlList, UrlListItem } from "../../components/UrlList";
import { useTitle } from "../../hooks/useTitle";

export default function SongPage({ mode }: { mode?: "repertoire" }) {

    const isRepertoire: boolean = mode === "repertoire"

    useTitle(isRepertoire ? "Repertoar" : "Alle noter");

    let data = useOutletContext<SheetArchiveTitle[]>()
    if (isRepertoire)
        data = data.filter(item => !!item.isRepertoire)

    return (
        <>
            <h1>Notearkiv</h1>
            <UrlList>
                {data.map(song => (
                    <UrlListItem
                        key={song.url}
                        to={`/notearkiv/${isRepertoire ? "repertoar" : "alle"}/${song.url}`}
                        text={song.title}
                    />
                ))
                }
            </UrlList>
        </>
    )
}


