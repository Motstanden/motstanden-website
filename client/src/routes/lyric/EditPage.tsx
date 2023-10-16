import { useNavigate, useOutletContext } from "react-router-dom";
import { UpsertLyricForm } from "./components/UpsertLyricForm";
import { SongLyric } from "common/interfaces";

export function EditLyricPage() {

    const lyric = useOutletContext<SongLyric>();

    const navigate = useNavigate();

    const onAbortClick = () => navigate("..");

    const onPostSuccess = () => { }; // todo

    return (
        <div>
            <h1>Rediger Trall</h1>
            <UpsertLyricForm
                initialValue={lyric}
                onAbortClick={onAbortClick}
                onPostSuccess={onPostSuccess}
                postUrl={`/song-lyric/${lyric.id}/update`}
            />
        </div>
    )
}