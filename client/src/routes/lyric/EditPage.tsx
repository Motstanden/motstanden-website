import { useQueryClient } from "@tanstack/react-query"
import { NewSongLyric } from "common/interfaces"
import { useNavigate } from "react-router-dom"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { buildLyricItemUrl, getLyricItemContextQueryKey, useLyricItemContext } from "./Context"
import { UpsertLyricForm } from "./components/UpsertLyricForm"

export function EditLyricPage() {
    useAppBarHeader("Studenttraller")

    const [allLyrics, lyric] = useLyricItemContext()
    const usedTitles = allLyrics.map(item => item.title).filter(item => item !== lyric.title);

    useTitle(`${lyric.title}`)

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onAbortClick = () => navigate("..");

    const queryKey = getLyricItemContextQueryKey(lyric.id)

    const onPostSuccess = (newValue: NewSongLyric) => {
        const titleChanged = newValue.title.trim().toLowerCase() !== lyric.title.trim().toLowerCase()
        const url = titleChanged 
            ? `/studenttraller/${lyric.id}` 
            : buildLyricItemUrl(newValue.title, newValue.isPopular)
        navigate(url, { replace: true })
        queryClient.invalidateQueries({queryKey: queryKey})
    }


    return (
        <div>
            <h1>Rediger Trall</h1>
            <UpsertLyricForm
                initialValue={lyric}
                onAbortClick={onAbortClick}
                onPostSuccess={onPostSuccess}
                storageKey={queryKey}
                httpVerb="PATCH"
                url={`/api/lyrics/${lyric.id}`}
                usedTitles={usedTitles}
            />
        </div>
    )
}