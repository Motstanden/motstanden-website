import { NewSongLyric } from "common/interfaces";
import { UpsertLyricForm } from "./components/UpsertLyricForm";
import { useNavigate } from "react-router-dom";
import { useLyricContext } from "./Context";

export function NewLyricPage() {
    const allLyrics = useLyricContext()
    const usedTitles = allLyrics.map(item => item.title);

    const navigate = useNavigate();

    const onAbortClick = () => navigate("..");

    return (
        <div>
            <h1>Ny Trall</h1>
            <UpsertLyricForm
                initialValue={emptyLyricItem}
                onAbortClick={onAbortClick}
                postUrl="/api/song-lyric/new"
                usedTitles={usedTitles}
            />
        </div>
    )
}

const emptyLyricItem: NewSongLyric = {
    title: "",
    content: "",
    isPopular: false,
}