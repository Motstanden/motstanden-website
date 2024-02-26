import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { getLyricItemContextQueryKey, useLyricItemContext } from "./Context";
import { UpsertLyricForm } from "./components/UpsertLyricForm";

export function EditLyricPage() {
    const [allLyrics, lyric] = useLyricItemContext()
    const usedTitles = allLyrics.map(item => item.title).filter(item => item !== lyric.title);
    const queryClient = useQueryClient();

    useTitle(`${lyric.title}`)

    const navigate = useNavigate();

    const onAbortClick = () => navigate("..");

    const queryKey = getLyricItemContextQueryKey(lyric.id)

    const onPostSuccess = async () => {
        await queryClient.invalidateQueries({
            queryKey: queryKey
        })
    }

    return (
        <div>
            <h1>Rediger Trall</h1>
            <UpsertLyricForm
                initialValue={lyric}
                onAbortClick={onAbortClick}
                onPostSuccess={onPostSuccess}
                storageKey={JSON.stringify(queryKey)}
                postUrl={`/api/song-lyric/${lyric.id}/update`}
                usedTitles={usedTitles}
            />
        </div>
    )
}