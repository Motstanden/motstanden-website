import { ImageAlbum } from "common/interfaces"
import { useOutletContext } from "react-router-dom"
import { UrlList, UrlListItem } from "src/components/UrlList"
    
export default function AlbumListPage() {
    const data = useOutletContext<ImageAlbum[]>()
    return (
        <>
            <h1>Bildealbum</h1>
            <Albums items={data}/>
        </>
    )
}

function Albums({items}: {items: ImageAlbum[]}) {

    return (
        <UrlList>
            {items.map(album => (
                <UrlListItem 
                    key={album.id} 
                    text={album.title} 
                    to={`/bilder/${album.url}`}/>
            ))}
            
        </UrlList>
    )
}