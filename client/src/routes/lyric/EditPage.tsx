import { useNavigate } from "react-router-dom";
import { useLyricItemContext } from "./Context";
import { UpsertLyricForm } from "./components/UpsertLyricForm";

export function EditLyricPage() {
    const [allLyrics, lyric] = useLyricItemContext()
    const usedTitles = allLyrics.map(item => item.title).filter(item => item !== lyric.title);

    const navigate = useNavigate();

    const onAbortClick = () => navigate("..");

    return (
        <div>
            <h1>Rediger Trall</h1>
            <UpsertLyricForm
                initialValue={lyric}
                onAbortClick={onAbortClick}
                postUrl={`/api/song-lyric/${lyric.id}/update`}
                usedTitles={usedTitles}
            />
        </div>
    )
}