import { Image } from "common/interfaces"
import { useOutletContext } from "react-router-dom"

export default function AlbumPage() {
    const images = useOutletContext<Image[]>()
    console.log(images)
    return (
        <>
            <h1>Albumnavn</h1>
        </>
    )
}