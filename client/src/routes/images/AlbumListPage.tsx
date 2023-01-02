import { ImageAlbum } from "common/interfaces"
import { useOutletContext } from "react-router-dom"

    
export default function AlbumListPage() {
    const data = useOutletContext<ImageAlbum[]>()
    console.log(data)
    return (
        <>
            <h1>Bildealbum</h1>
        </>
    )
}