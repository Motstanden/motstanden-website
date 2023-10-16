import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getLyricItemContextQueryKey, useLyricItemContext } from "./Context";
import { UpsertLyricForm } from "./components/UpsertLyricForm";

export function EditLyricPage() {
    const [allLyrics, lyric] = useLyricItemContext()
    const usedTitles = allLyrics.map(item => item.title).filter(item => item !== lyric.title);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const onAbortClick = () => navigate("..");

    const onPostSuccess = async () => {
        await queryClient.invalidateQueries(getLyricItemContextQueryKey(lyric.id))
    }

    return (
        <div>
            <h1>Rediger Trall</h1>
            <UpsertLyricForm
                initialValue={lyric}
                onAbortClick={onAbortClick}
                onPostSuccess={onPostSuccess}
                postUrl={`/api/song-lyric/${lyric.id}/update`}
                usedTitles={usedTitles}
            />
        </div>
    )
}