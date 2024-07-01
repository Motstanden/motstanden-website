import { useNavigate } from "react-router-dom"
import { useTitle } from "src/hooks/useTitle"
import { getLyricItemContextQueryKey, useLyricItemContext } from "./Context"
import { UpsertLyricForm } from "./components/UpsertLyricForm"

export function EditLyricPage() {
    const [allLyrics, lyric] = useLyricItemContext()
    const usedTitles = allLyrics.map(item => item.title).filter(item => item !== lyric.title);

    useTitle(`${lyric.title}`)

    const navigate = useNavigate();

    const onAbortClick = () => navigate("..");

    const queryKey = getLyricItemContextQueryKey(lyric.id)


    return (
        <div>
            <h1>Rediger Trall</h1>
            <UpsertLyricForm
                initialValue={lyric}
                onAbortClick={onAbortClick}
                storageKey={queryKey}
                httpVerb="PATCH"
                url={`/api/lyrics/${lyric.id}`}
                usedTitles={usedTitles}
            />
        </div>
    )
}