import { useQuery } from "@tanstack/react-query"
import { ImageAlbum } from "common/interfaces"
import { Outlet } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

const albumListQueryKey = ["FetchAllAlbums"]

export const useAlbumListInvalidator = () => useQueryInvalidator(albumListQueryKey)

export function AlbumListContext() {

    const {isLoading, isError, data, error} = useQuery<ImageAlbum[]>(albumListQueryKey, () => fetchAsync<ImageAlbum[]>("/api/image-albums"))

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

    // TODO: Get data about the album here

    return (
        <Outlet />
    )
}