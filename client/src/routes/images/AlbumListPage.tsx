import { ImageList, ImageListItem, ImageListItemBar, Theme, useMediaQuery } from "@mui/material"
import { ImageAlbum } from "common/interfaces"
import { Link, useOutletContext } from "react-router-dom"
    
export default function AlbumListPage() {
    const data: ImageAlbum[] = useOutletContext<ImageAlbum[]>()
    return (
        <>
            <h2>Bilder</h2>
            <Albums items={data}/>
        </>
    )
}

function Albums({items}: {items: ImageAlbum[]}) {

    const isSmallScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.between(410, "md"))
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.only("md"))
    const isLargeScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.up("lg"))

    let listProps = {cols: 1, gap: 10}
    if(isSmallScreen) listProps  = {cols: 2, gap: 10};
    if(isMediumScreen) listProps = {cols: 3, gap: 20};
    if(isLargeScreen) listProps  = {cols: 4, gap: 30};

    return (
        <ImageList {...listProps} rowHeight={250} variant="standard">
            {items.map(album => (
                <Link to={`/bilder/${album.url}`} key={album.id}>
                    <ImageListItem>
                        <img 
                            src={`/${album.coverImageUrl}`} 
                            style={{
                                maxHeight: "250px",
                                borderRadius: "10px"
                            }}
                        />
                        <ImageListItemBar
                            title={album.title}
                            subtitle={`${album.imageCount} bilder`}
                        />
                    </ImageListItem>
                </Link>
            ))}
        </ImageList>
    )
}