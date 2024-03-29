import { NewSongLyric } from "common/interfaces";
import { useNavigate } from "react-router-dom";
import { useTitle } from "src/hooks/useTitle";
import { usePendingLyricContext } from "./Context";
import { UpsertLyricForm } from "./components/UpsertLyricForm";

export function NewLyricPage() {
    useTitle("Ny")

    const {lyrics, isPending} = usePendingLyricContext()
    const usedTitles = isPending ? [] : lyrics.map(item => item.title)

    const navigate = useNavigate();

    const onAbortClick = () => navigate("/studenttraller/populaere");

    return (
        <div>
            <h1>Ny Trall</h1>
            <UpsertLyricForm
                storageKey={["LyricItem", "New"]}
                initialValue={emptyLyricItem}
                onAbortClick={onAbortClick}
                postUrl="/api/song-lyric/new"
                usedTitles={usedTitles}
                disabled={isPending}
            />
        </div>
    )
}

const emptyLyricItem: NewSongLyric = {
    title: "",
    content: "",
    isPopular: false,
}