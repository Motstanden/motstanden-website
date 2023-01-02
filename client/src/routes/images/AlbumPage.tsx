import { ImageList, ImageListItem, Theme, useMediaQuery } from "@mui/material";
import { ImageAlbum } from "common/interfaces";
import { useOutletContext } from "react-router-dom";

export default function AlbumPage() {
    const album: ImageAlbum = useOutletContext<ImageAlbum>()

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"))

    let listProps = {cols: 3, gap: 20}
    if( isSmallScreen ) listProps = { cols: 2, gap: 10 };
    if( isLargeScreen ) listProps = { cols: 4, gap: 30}
    return (
        <>
            <h1>{album.title}</h1>
            <ImageList {...listProps} >
                {album.images.map( image => (
                    <ImageListItem key={image.url}>
                        <img src={`/${image.url}`} loading="lazy"/>
                    </ImageListItem>
                ))}
            </ImageList>
        </>
    )
}