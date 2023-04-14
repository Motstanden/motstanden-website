import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, ImageList, ImageListItem, Link, Typography } from "@mui/material";
import { ImageAlbum } from "common/interfaces";
import dayjs from 'dayjs';
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { ImageLightBox, useIndexParam } from 'src/components/ImageLightBox';
import { ImageGrid } from './components/ImageGrid';

export default function AlbumPage() {
    const album: ImageAlbum = useOutletContext<ImageAlbum>()

    return (
        <>
            <Crumbs  title={album.title}/>
            <CreationInfo created={album.createdAt} updated={album.updatedAt}/>
            <AlbumViewer album={album}/>
        </>
    )
}

function Crumbs( { title }: { title: string}) {
    return (
        <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" opacity={0.7} />} 
            style={{marginBottom: "5px", marginTop: "20px"}}
            >
            <Link 
                underline='hover' 
                color="inherit" 
                component={RouterLink} 
                to={"/bilder"}
                style={{opacity: 0.7}}
                variant="h5"
            >
                Bilder
            </Link>
            <Typography variant='h5'>
                {title}
            </Typography>
        </Breadcrumbs>
    )
}

function CreationInfo( { created, updated}: {created: string, updated: string}) {

    const prettyCreated = dayjs(created).utc(true).local().format("DD. MMM YYYY HH:mm")
    const prettyUpdated = dayjs(updated).utc(true).local().format("DD. MMM YYYY HH:mm")

    return (
        <div style={{
                fontSize: "small",
                opacity: 0.75,
                paddingBlock: "10px",
                display: "grid",
                gridTemplateColumns: "min-content auto",
                columnGap: "5px",
                rowGap: "4px"
            }}
        >
            <div>Opprettet:</div>
            <div>{prettyCreated}</div>
            {prettyCreated !== prettyUpdated && (
                <>
                    <div>Redigert:</div>
                    <div>{prettyUpdated}</div>
                </>
            )}
        </div>
    )
}

function AlbumViewer( { album }: { album: ImageAlbum }  ) {

    const [indexParam, setIndexParam] = useIndexParam()     // eslint-disable-line @typescript-eslint/no-unused-vars

    const onImageClick = (index: number) => {
        setIndexParam(index + 1)
    }

    const onMouseEnterImage = () => {
        document.body.style.cursor = "pointer"   
    }

    const onMouseLeaveImage = () => {
        document.body.style.cursor = "auto"   
    }

    return (
        <>
            <ImageGrid>
                {album.images.map( (image, index ) => (
                    <ImageListItem key={image.url}>
                        <img 
                            onMouseEnter={onMouseEnterImage}
                            onMouseLeave={onMouseLeaveImage}
                            src={`/${image.url}`} 
                            loading="lazy"
                            onClick={() => onImageClick(index)}
                            style={{
                                maxHeight: "250px",
                                borderRadius: "10px"
                            }}
                            />
                    </ImageListItem>
                ))}
            </ImageGrid>
            <ImageLightBox images={album.images.map( img => `/${img.url}`)} />
        </>
    )
}