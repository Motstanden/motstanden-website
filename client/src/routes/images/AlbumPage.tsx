import { ImageAlbum } from "common/interfaces"
import { useOutletContext } from "react-router-dom"

export default function AlbumPage() {
    const album: ImageAlbum = useOutletContext<ImageAlbum>()
    return (
        <>
            <h1>{album.title}</h1>
            <ul>
                {album.images.map( image => (
                    <li key={image.url}>
                        <img src={`/${image.url}`} height="150px"/>
                    </li>
                ))}
            </ul>
        </>
    )
}