import { useQuery } from "@tanstack/react-query"
import { Image, ImageAlbum } from "common/interfaces"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

const albumListQueryKey = ["FetchAllAlbums"]

export const useAlbumListInvalidator = () => useQueryInvalidator(albumListQueryKey)

export function AlbumListContext() {

    const {isLoading, isError, data, error} = useQuery<ImageAlbum[]>(albumListQueryKey, () => fetchAsync<ImageAlbum[]>("/api/image-album/all"))

    if (isLoading) 
        return <AlbumPageContainer>Loading...</AlbumPageContainer> // TODO: Render a page skeleton here

    if(isError)
        return <AlbumPageContainer>{`Error: ${error}`}</AlbumPageContainer>

    return (
        <AlbumPageContainer>
            <Outlet context={data}/>
        </AlbumPageContainer>
    )
}

function AlbumPageContainer({ children }: { children?: React.ReactNode }) {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/bilder", label: "Album" },
                { to: "/bilder/ny", label: "ny" },
            ]}
        >
            {children}
        </TabbedPageContainer>
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
    const {isLoading, isError, data, error} = useQuery<Image[]>([albumListQueryKey, album.id], () => fetchAsync<Image[]>(`/api/image-album/${album.id}/images`))

    if (isLoading) 
        return <>Loading...</> // TODO: Render a page skeleton here

    if(isError)
        return <>{`Error: ${error}`}</>

    const dataContext: ImageAlbum = {...album, images: data }
    
    return (
        <Outlet context={dataContext}/>
    )
} 