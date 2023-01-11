import AddIcon from '@mui/icons-material/Add';
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import { ImageAlbum } from "common/interfaces";
import { Link, LinkProps, useOutletContext } from "react-router-dom";
    
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
    const isSmallScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.between(400, 800))
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.between(800, 1000))
    const isLargeScreen = useMediaQuery((theme: Theme)  => theme.breakpoints.up(1000))

    let colCount = 1
    if(isSmallScreen)  colCount = 2;
    if(isMediumScreen) colCount = 3;
    if(isLargeScreen)  colCount = 4;

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            rowGap: "20px",
            columnGap: "30px"
        }}>
            <NewAlbumItem/>
            {items.map( album => (
                <AlbumItem key={album.id} album={album}/>
            ))}
        </div>
    )
}

function AlbumItem( {album}: {album: ImageAlbum}) {

    const linkProps: LinkProps = {
        to:`/bilder/${album.url}`, 
        style: {
            textDecoration: "none",
            color: "inherit"
        }
    }
 
    return (
        <div>
            <Link {...linkProps}>
                <img
                    src={`/${album.coverImageUrl}`} 
                    alt={album.title}
                    loading="lazy"
                    style={{
                        width: `100%`,
                        aspectRatio: 1,
                        objectFit: "cover",
                        borderRadius: "10px"
                    }}
                />
            </Link>
            <Link {...linkProps} 
                style={{
                    ...linkProps.style,
                    fontSize: "large",
                    marginTop: "10px",
                    fontWeight: "bold",
                }}
            >
                {album.title}
            </Link>
            <br/>
            <Link {...linkProps} 
                style={{
                    ...linkProps.style,
                    opacity: "0.65",
                }}
            >
                {album.imageCount} bilder
            </Link>
        </div>
    )
}

function NewAlbumItem() {
    const theme = useTheme()
    return (
        <div>
            <div style={{
                aspectRatio: 1,
                borderRadius: "10px",
                borderWidth: "1px",
                borderStyle: "solid",
                opacity: 0.5,
                backgroundColor: theme.palette.action.hover,
                cursor: "pointer",
                
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}>
                <AddIcon style={{fontSize: `50px`}}/>
            </div>
            <div style={{
                    cursor: "pointer",
                    fontSize: "large",
                    marginTop: "15px",
                    fontWeight: "bold"
             }}
            >
                Nytt album
            </div>
        </div>
    )
}