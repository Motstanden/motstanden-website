import { useQuery } from "@tanstack/react-query"
import { Image, ImageAlbum } from "common/interfaces"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { fetchFn } from "src/utils/fetchAsync"

const albumListQueryKey = ["FetchAllAlbums"]

export const useAlbumListInvalidator = () => useQueryInvalidator(albumListQueryKey)

export function AlbumListContext() {

    const {isLoading, isError, data, error} = useQuery<ImageAlbum[]>({
        queryKey: albumListQueryKey, 
        queryFn: fetchFn("/api/image-album/all")
    })

    if (isLoading) 
        return <PageContainer>Loading...</PageContainer> // TODO: Render a page skeleton here

    if(isError)
        return <PageContainer>{`Error: ${error}`}</PageContainer>

    return (
        <PageContainer>
            <Outlet context={data}/>
        </PageContainer>
    )
}

export function AlbumContext() {

    const allAlbums: ImageAlbum[] = useOutletContext<ImageAlbum[]>()
    const params = useParams();

    const title = params.title
    if(!title)
        return <Navigate to="/bilder"/>
    
    const album = allAlbums.find( item => item.url === title)
    if(!album)
        return <Navigate to="/bilder"/>
    
    return (
        <FetchAlbumContext album={album}/>
    )
}

function FetchAlbumContext( {album}: { album: ImageAlbum}) {
    const {isPending, isError, data, error} = useQuery<Image[]>({
        queryKey: [albumListQueryKey, album.id],
        queryFn: fetchFn(`/api/image-album/${album.id}/images`)
    })

    if (isPending) 
        return <>Loading...</> // TODO: Render a page skeleton here

    if(isError)
        return <>{`Error: ${error}`}</>

    const dataContext: ImageAlbum = {...album, images: data }
    
    return (
        <Outlet context={dataContext}/>
    )
} 