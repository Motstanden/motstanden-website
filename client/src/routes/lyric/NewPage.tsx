import { NewSongLyric } from "common/interfaces";
import { UpsertLyricForm } from "./components/UpsertLyricForm";
import { useNavigate } from "react-router-dom";

export function NewLyricPage() {
    const navigate = useNavigate();
    
    const onAbortClick = () => navigate("..");

    const onPostSuccess = () => { };

    return (
        <div>
            <h1>Ny Trall</h1>
            <UpsertLyricForm
                initialValue={emptyLyricItem}
                onAbortClick={onAbortClick}
                onPostSuccess={onPostSuccess}
                postUrl="/song-lyric/new"
            />
        </div>
    )
}

const emptyLyricItem: NewSongLyric = {
    title: "",
    content: "",
    isPopular: false,
}