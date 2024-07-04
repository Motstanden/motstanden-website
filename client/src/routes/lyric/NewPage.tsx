import { useQueryClient } from "@tanstack/react-query"
import { NewSongLyric } from "common/interfaces"
import { useNavigate } from "react-router-dom"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"
import { buildLyricItemUrl, lyricContextQueryKey, usePendingLyricContext } from "./Context"
import { UpsertLyricForm } from "./components/UpsertLyricForm"

export function NewLyricPage() {
    useAppBarHeader("Studenttraller")
    useTitle("Ny")

    const {lyrics, isPending} = usePendingLyricContext()
    const usedTitles = isPending ? [] : lyrics.map(item => item.title)

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onAbortClick = () => navigate("/studenttraller/populaere");

    const onPostSuccess = async (newValue: NewSongLyric) => {
        await queryClient.invalidateQueries({queryKey: lyricContextQueryKey})   
        const url = buildLyricItemUrl(newValue.title, newValue.isPopular)
        navigate(url, { replace: true })
    }

    return (
        <div>
            <h1>Ny Trall</h1>
            <UpsertLyricForm
                storageKey={["LyricItem", "New"]}
                initialValue={emptyLyricItem}
                onAbortClick={onAbortClick}
                httpVerb="POST"
                url="/api/lyrics"
                usedTitles={usedTitles}
                disabled={isPending}
                onPostSuccess={onPostSuccess}
            />
        </div>
    )
}

const emptyLyricItem: NewSongLyric = {
    title: "",
    content: "",
    isPopular: false,
}